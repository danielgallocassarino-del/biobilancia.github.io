// Inizializzazione variabili globali
const DB = window.DB;
const $  = (s) => document.querySelector(s);

const COLORI   = { verde: "#2ecc71", giallo: "#f1c40f", rosso: "#e74c3c" };
const ETICHETTA = { verde: "OK", giallo: "Monitorare", rosso: "Intervenire" };
const specieById = Object.fromEntries(DB.specie.map(s => [s.id, s]));

/* ---------- 1. KPI ---------- */
function renderKpi() {
  const conta = (stato) => DB.zone.filter(z => z.stato === stato).length;
  const items = [
    { val: DB.zone.length, lbl: "Zone monitorate" },
    { val: conta("verde"), lbl: "Verdi (OK)" },
    { val: conta("giallo"), lbl: "Gialle (monitorare)" },
    { val: conta("rosso"), lbl: "Rosse (intervenire)" },
    { val: DB.specie.length, lbl: "Specie in catalogo" }
  ];
  $("#kpi").innerHTML = items.map(i =>
    `<div class="card"><div class="val">${i.val}</div><div class="lbl">${i.lbl}</div></div>`
  ).join("");
}

/* ---------- 2. Mappa ---------- */
function renderMap() {
  // Inizializza la mappa
  const map = L.map("map").setView([42.422, 12.103], 16);
  
  // Usa Esri World Imagery (Satellite, non bloccato in locale)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(map);

  // Disegna le zone
  DB.zone.forEach(z => {
    const layer = L.polygon(z.coords, {
      color: COLORI[z.stato],
      fillColor: COLORI[z.stato],
      fillOpacity: 0.4,
      weight: 3
    }).addTo(map);

    layer.bindTooltip(`${z.nome} — ${ETICHETTA[z.stato]}`, { sticky: true });
    
    // Evento click per mostrare i dettagli
    layer.on("click", () => renderDetail(z));
  });
}

/* ---------- 3. Dettaglio zona ---------- */
function renderDetail(z) {
  const tags = z.specieRilevate.map(id => {
    const s = specieById[id];
    return `<span class="tag">${s.icona} ${s.nome}</span>`;
  }).join("");

  $("#detail").innerHTML = `
    <h2>${z.nome}</h2>
    <p><span class="pill ${z.stato}">${ETICHETTA[z.stato]}</span></p>

    <div class="detail-row">
      <strong>Confidenza AI:</strong> ${(z.confidenza * 100).toFixed(0)}%
    </div>
    <div class="detail-row">
      <strong>Conferma a terra:</strong>
      ${z.confermaTerrestre ? "✅ Effettuata" : "⚠️ Da effettuare"}
    </div>

    <div class="detail-row">
      <strong>Specie rilevate via eDNA</strong><br>${tags}
    </div>

    <div class="raccomandazione">
      <strong>Raccomandazione</strong><br>${z.raccomandazione}
    </div>

    <button disabled style="margin-top:16px; width:100%; padding:10px; border:none; border-radius:8px;
      background:${z.confermaTerrestre ? "#cfd8cc" : "var(--accento)"}; color:#fff; cursor:not-allowed; font-weight:600">
      ${z.confermaTerrestre ? "Confermata" : "Richiedi conferma a terra (Demo)"}
    </button>
  `;
}

/* ---------- 4. Specie ---------- */
function renderSpecies(filtro = "tutte") {
  const lista = DB.specie.filter(s => filtro === "tutte" || s.tipo === filtro);
  $("#speciesGrid").innerHTML = lista.map(s => `
    <div class="specie">
      <div class="top">
        <div>
          <div class="nome">${s.nome}</div>
          <div class="sci">${s.scientifico}</div>
        </div>
        <div class="icona">${s.icona}</div>
      </div>
      <span class="tipo ${s.tipo}">${s.tipo}</span>
      ${s.soglia ? `<div class="muted" style="margin-top:8px;font-size:0.75rem;">Soglia intervento: ${s.soglia}</div>` : ""}
    </div>
  `).join("");
}

// Gestione filtri
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelectorAll("#filters button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderSpecies(btn.dataset.filter);
});

/* ---------- 5. Statistica DNA (Chart.js) ---------- */
function renderCharts() {
  const ultimo = DB.campioni[DB.campioni.length - 1];

  // A. Bar Chart: Abbondanza
  const ids = Object.keys(ultimo.specie);
  new Chart($("#chartBar"), {
    type: "bar",
    data: {
      labels: ids.map(id => specieById[id].nome),
      datasets: [{
        data: ids.map(id => ultimo.specie[id]),
        backgroundColor: ids.map(id => specieById[id].tipo === "parassita" ? "#e74c3c" : "#2ecc71"),
        borderRadius: 4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { title: { display: true, text: "Sequenze" } } }
    }
  });

  // B. Line Chart: Rapporto Predatori/Parassiti
  const serie = DB.campioni.map(c => {
    const predatori = Object.entries(c.specie).filter(([id]) => specieById[id].tipo === "predatore").reduce((a,[,v]) => a+v, 0);
    const parassiti = Object.entries(c.specie).filter(([id]) => specieById[id].tipo === "parassita").reduce((a,[,v]) => a+v, 0);
    return parassiti === 0 ? 0 : +(predatori / parassiti).toFixed(2);
  });

  new Chart($("#chartLine"), {
    type: "line",
    data: {
      labels: DB.campioni.map(c => c.data),
      datasets: [{
        label: "Rapporto P/P",
        data: serie,
        borderColor: "#2f7d3a",
        backgroundColor: "rgba(47,125,58,.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: "#2f7d3a"
      }]
    },
    options: { plugins: { legend: { display: false } } }
  });

  // C. Doughnut Chart: Composizione
  const pred = Object.entries(ultimo.specie).filter(([id]) => specieById[id].tipo === "predatore").reduce((a,[,v]) => a+v, 0);
  const paras = Object.entries(ultimo.specie).filter(([id]) => specieById[id].tipo === "parassita").reduce((a,[,v]) => a+v, 0);

  new Chart($("#chartDoughnut"), {
    type: "doughnut",
    data: {
      labels: ["Parassiti", "Predatori"],
      datasets: [{ data: [paras, pred], backgroundColor: ["#e74c3c", "#2ecc71"], borderWidth: 0 }]
    },
    options: { cutout: "65%", plugins: { legend: { position: "bottom" } } }
  });
}

/* ---------- Avvio ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderKpi();
  renderMap();
  renderSpecies();
  renderCharts();
});
