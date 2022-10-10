
//exemple de jsonfile
var jsonfile = {
  "jsonarray": [{
    "universite": "universite Lille",
    "nb": 36
  }, {
    "universite": "universite Artois",
    "nb": 33
  }, {
    "universite": "universite Valencienne",
    "nb": 31
  }]
};

// importer des json


//label et data utilises pour un graphique
var labels = jsonfile.jsonarray.map(function(e){
  return e.universite;
});

var data = jsonfile.jsonarray.map(function(e){
  return e.nb;
});

// recuperation id pour l'affichage du futur graphique
const ctx = document.getElementById('myChart').getContext('2d');

// configuration du graphique
const config = {
  type: "bar",
  data: {
    labels: labels,
    datasets: [{
      label: 'Graph Line',
      data: data,
      backgroundColor: 'rgba(0, 119, 204, 0.3)'
    }]
  },
  options: {
      title: {
        display: true,
        text: 'Nouveau graphique',
        padding: {
          top: 10,
          bottom: 30
          }
      }
  }
};

const chart = new Chart(ctx, config);