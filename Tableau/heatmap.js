// heatmap : carte de chaleur
// Creation d'une carte de chaleur afin de mieux visualiser les distances et mode de transport qui
//   qui consomment le plus
// Utilisation de plotly

// recuperation des donnees
d3.json("http://127.0.0.1:8000/data_mobilite/tableau/calculCO2", function(fig){
  // variables des x (abscisses) = distances discr�tis�es
  const xValues = Object.keys(fig.data[0]);

  // variables des y (ordonn�es) = mode de transport
  const yValues = fig.mode.map(
  function(index){
    return index;
  });
  
  // variables des z (couleur) = rejet de CO2 annuel
  // boucle for pour aller chercher toutes les valeurs
  let zValues = [];
  for(i=0 ; i< fig.data.length ; i++){
    let intermediaire = Object.values(fig.data[i]);
    zValues.push(intermediaire);
  }
  
  // creation de la variable data utilis�e pour faire la heatmap
  var data = [
  {
    z: zValues, // couleur : rejets de CO2
    x: xValues, // distances discr�tis�es
    y: yValues, // modes de transport
    type: 'heatmap', // preciser quel type de graphique � uyiliser
    colorscale: 'RdBu',
    hoverongaps: false
    }
  ];

  // param�tres du graphique : titre, taille, police, ...
  var layout = {
    title: 'Carte de chaleur des rejets annuels de GES des �tudiants et des personnels de l Universite de Lille ',
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

  //cr�ation du graphique
  Plotly.newPlot('myDiv', data, layout);
  
  
})