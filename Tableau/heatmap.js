//heatmap
// with plotly

d3.json("http://127.0.0.1:8000/data_mobilite/tableau/calculCO2", function(fig){
  // variables des x (abscisses) = distances discrétisées
  const xValues = Object.keys(fig.data[0])
  console.log(xValues);
  // variables des y (ordonnées) = mode de transport
  const yValues = fig.mode.map(
  function(index){
    return index;
  });
  console.log(yValues);
  // variables des z (couleur) = rejet de CO2 annuel
  // boucle for pour aller chercher toutes les valeurs
  let zValues = [];
  for(i=0 ; i< fig.data.length ; i++){
    let intermediaire = Object.values(fig.data[i]);
    zValues.push(intermediaire);
  }
  
  console.log(zValues);
  
  var data = [
  {
    z: zValues,
    x: xValues,
    y: yValues,
    type: 'heatmap',
    colorscale: 'RdBu',
    hoverongaps: false
    }
  ];

  var layout = {
    title: 'Carte de chaleur des rejets annuels de GES des étudiants et des personnels de l Universite de Lille ',
    annotations: [],
    xaxis: {
      ticks: '',
      side: 'top',
      width: 500,
      height: 500
    },
    yaxis: {
      ticks: '',
      ticksuffix: ' ',
      width: 500,
      height: 500,
      autosize: false
    },
    font: {
      family: 'Arial',
      size: 10
    }
  };

  Plotly.newPlot('myDiv', data, layout);
  
  
})