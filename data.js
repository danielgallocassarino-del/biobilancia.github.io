window.DB = {
  azienda: { nome: "Azienda Demo Bio", localita: "Lazio" },

  // Catalogo specie
  specie: [
    { id: "tu", nome: "Ragnetto rosso",      scientifico: "Tetranychus urticae",       tipo: "parassita", ordine: "Acari",       soglia: 5, icona: "🕷️" },
    { id: "pp", nome: "Acaro predatore",     scientifico: "Phytoseiulus persimilis",   tipo: "predatore", ordine: "Acari",       soglia: 0, icona: "🐞" },
    { id: "fo", nome: "Tripide occidentale", scientifico: "Frankliniella occidentalis", tipo: "parassita", ordine: "Tisanotteri", soglia: 3, icona: "🦟" },
    { id: "ol", nome: "Antocoride",          scientifico: "Orius laevigatus",           tipo: "predatore", ordine: "Eterotteri",  soglia: 0, icona: "🐜" },
    { id: "bt", nome: "Mosca bianca",        scientifico: "Bemisia tabaci",             tipo: "parassita", ordine: "Rincoti",     soglia: 4, icona: "🦋" },
    { id: "ef", nome: "Encarsia",            scientifico: "Encarsia formosa",           tipo: "predatore", ordine: "Imenotteri",  soglia: 0, icona: "🐝" }
  ],

  // Zone = poligoni sulla mappa
  zone: [
    { id: "A", nome: "Serra Nord – A",  stato: "verde",  confidenza: 0.91, confermaTerrestre: true,
      specieRilevate: ["tu","pp","ol"],
      raccomandazione: "Predatori sufficienti. Nessun rilascio necessario.",
      coords: [[42.4240,12.1000],[42.4240,12.1020],[42.4220,12.1020],[42.4220,12.1000]] },

    { id: "B", nome: "Serra Nord – B",  stato: "giallo", confidenza: 0.74, confermaTerrestre: false,
      specieRilevate: ["tu","pp","fo"],
      raccomandazione: "Ricontrollare tra 3 giorni. Rapporto predatore/parassita in calo.",
      coords: [[42.4240,12.1020],[42.4240,12.1040],[42.4220,12.1040],[42.4220,12.1020]] },

    { id: "C", nome: "Serra Nord – C",  stato: "rosso",  confidenza: 0.88, confermaTerrestre: true,
      specieRilevate: ["tu","fo"],
      raccomandazione: "Rilasciare Phytoseiulus persimilis, rapporto 1:10.",
      coords: [[42.4240,12.1040],[42.4240,12.1060],[42.4220,12.1060],[42.4220,12.1040]] },

    { id: "D", nome: "Campo Sud – D",   stato: "verde",  confidenza: 0.83, confermaTerrestre: true,
      specieRilevate: ["bt","ef","ol"],
      raccomandazione: "Nessun intervento. Biodiversità in equilibrio.",
      coords: [[42.4220,12.1000],[42.4220,12.1020],[42.4200,12.1020],[42.4200,12.1000]] },

    { id: "E", nome: "Campo Sud – E",   stato: "giallo", confidenza: 0.68, confermaTerrestre: false,
      specieRilevate: ["fo","ol"],
      raccomandazione: "Monitorare. Confidenza bassa, richiesta conferma a terra.",
      coords: [[42.4220,12.1020],[42.4220,12.1040],[42.4200,12.1040],[42.4200,12.1020]] },

    { id: "F", nome: "Campo Sud – F",   stato: "rosso",  confidenza: 0.92, confermaTerrestre: true,
      specieRilevate: ["bt","tu"],
      raccomandazione: "Rilasciare Encarsia formosa per il controllo della mosca bianca.",
      coords: [[42.4220,12.1040],[42.4220,12.1060],[42.4200,12.1060],[42.4200,12.1040]] }
  ],

  // Campioni DNA aggregati per data
  campioni: [
    { data: "2026-10-01", specie: { tu: 180, pp: 60,  fo: 40, ol: 25, bt: 15, ef: 5  } },
    { data: "2026-10-08", specie: { tu: 220, pp: 65,  fo: 55, ol: 28, bt: 20, ef: 6  } },
    { data: "2026-10-15", specie: { tu: 140, pp: 95,  fo: 60, ol: 40, bt: 22, ef: 14 } },
    { data: "2026-10-22", specie: { tu: 90,  pp: 120, fo: 45, ol: 55, bt: 18, ef: 20 } }
  ]
};
