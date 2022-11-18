
const API_URL = "http://127.0.0.1:8000/data_aggregation"
fetch(API_URL) 
   .then(res => res.json())         //recupère données format json           
   .then( JSONdata => {
      
      const labels  = JSONdata.data.Nb_utilisateurs_modeTransport_global.map(
      function(index){
        return index.Mode_transport;
      })

     const data_global = JSONdata.data.Nb_utilisateurs_modeTransport_global.map(
      function(index){
        return index.Nb_utilisateurs;
      }) 
    
     console.log(data_global)
     console.log(labels)
    
     const liste_data = Array(JSONdata.data.nb_univ).map(e => Array(JSONdata.data.nb_univ).fill("none"));
     for (let i = 0; i < JSONdata.data.nb_univ ; i++) {
      const tab = JSONdata.data.Nb_utilisateurs_modeTransport_univ[i].map((valeur) => valeur.Nb_utilisateurs)
      liste_data[i] = tab
     }
     console.log(liste_data)

    list_color = [ ['rgba(255, 205, 86, 0.2)'],  ['rgba(255, 99, 132, 0.2)'] , [ 'rgba(75, 192, 192, 0.2)'], ['rgba(54, 162, 235, 0.2)'] ]  // jaune, rouge, bleu clair, bleu
    datasets = []  // def datasets contruire data
    d_glob = { label: "Nb_utilisateurs_global", data: data_global, backgroundColor: ['rgba(54, 162, 235, 0.2)'] }
    datasets.push(d_glob)
    for (let i = 0; i < JSONdata.data.nb_univ ; i++) {
       const data = { label : JSONdata.data.Nb_utilisateurs_modeTransport_univ[i][0].Université, data: liste_data[i], backgroundColor: list_color[i]  }
       datasets.push(data)
    }

    console.log(datasets)
    
    const data = {   // def data construire config
      labels: labels,
      datasets
    }
    
    const config = { // def config pour créer le graphr
      type: 'bar',
      data,
      options : {
        plugins: {        
          title: {
            display: true,
            text: 'Nombre d utilisateur mode de transport par université',
            padding: {
              top: 10,
              bottom: 30
            }
          }
        }
      }
    };
  
    const mygraph = new Chart(  // creation du graphe
      document.getElementById('mygraph'), 
      config
    );

    async function getStockage_data() {
      const API_URL = "http://127.0.0.1:8000/data_aggregation"
      const res = await fetch(API_URL)
    }

  })
 


 
   
