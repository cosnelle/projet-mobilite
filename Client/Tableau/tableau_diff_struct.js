// tableau des GES en fonction des modes de transport et des distances
// utilisation d'une autre structure de données

// voir avec Oject
// code de Cosnelle

const url2 = "http://127.0.0.1:8000/data_mobilite/tableau/v2";

fetch(url2)
  .then(res => res.json())     
  .then( JSONdata => {
    
    // recuperation des donnees
    const labels  = JSONdata.data.Bus.map(
    function(index){
      return Object.keys(index)[0]; 
    })

    const data_global = JSONdata.data.Bus.map(
    function(index){
      return Object.values(index)[0];
    })
    
    //verification
    console.log(labels);
    console.log(data_global);
    
  })