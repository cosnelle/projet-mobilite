// utilisation API 

let ctx = null;

let devBarButton = null;
let devPieButton = null;

// regroupement des configurations
const charts ={
  devBar: config_bar,
  devPie: config_pie
};

let curChart = null;


const init = () => {
  // recuperation id pour l'affichage du futur graphique
  ctx = document.getElementById('myChart').getContext('2d');
  
  devBarButton = document.querySelector("#dev-Bar");
  devPieButton = document.querySelector("#dev-Pie");
  
  devBarButton.addEventListener('click', () =>{
    if(curChart !== null){
      curChart.destroy();
    }
    curChart = new Chart(ctx, config_bar);
  });

  devPieButton.addEventListener('click', () =>{
    if(curChart !== null){
      curChart.destroy();
    }
    curChart = new Chart(ctx, config_pie);
  });
  
};

window.addEventListener('load', init);
