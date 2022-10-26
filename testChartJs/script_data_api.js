// fetch block
function updateChart(){
  async function fetchData(){
    const url = 'http://127.0.0.1:8000/univ'; // specifier le chemin jusqu au fichier json (localhost)
    const response = await fetch(url);
    //attendre jusqu a ce que la requette soit complete
    const datapoints = await response.json();
    // verification de la console log
    console.log(datapoints);
    return datapoints;
  };

  fetchData().then(datapoints => {
    const Univ = datapoints.data.map(
      function(index){
        return index.Etablissement;
      })
    const Nbpers  = datapoints.data.map(
      function(index){
        return index.Nb_person;
      })
      
      console.log(Univ);
      console.log(Nbpers);
      
      myChart.config.data.labels = Univ;
      myChart.config.data.datasets[0].data = Nbpers;
      myChart.update();
  });
};


//data
const data = {
    labels: ['Univ Lille', 'Univ Artois', 'Univ Valenciennes'],
    datasets: [{
      label: 'Univ',
      data: [2,1,5] ,
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 205, 86, 0.2)'],
      borderColor : [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(51, 51, 51, 1)'
      ]
    }]
  }


//config
const config_bar = {
  type: 'bar',
  data,
  options : {
    plugins: {
      title: {
        display: true,
        text: 'Nbr de personnes dans chaque universite',
        padding: {
          top: 10,
          bottom: 30
        }
      }
    }
  }
};



//initialisation chart
const myChart = new Chart(
  document.getElementById('myChart'), 
  config_bar
);