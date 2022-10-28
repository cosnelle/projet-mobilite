const API_URL = "http://127.0.0.1:8000/data_aggregation"
fetch(API_URL) 
   .then(res => res.json())         //recupère données format json           
   .then(function(JSONdata) { 
    const data = {
      labels: JSONdata.data.Nb_utilisateurs_modeTransport_global.labels,
      datasets: [{
        label: "nb_utilisateurs_global",
        data: JSONdata.data.Nb_utilisateurs_modeTransport_global.data,
        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
      },
      {
        label: "nb_utilisateurs_univ_lille",
        data: JSONdata.data.Nb_utilisateurs_modeTransport_univ_Lille.data,
        backgroundColor: ['rgba(255, 205, 86, 0.2)'],
      }, 
      {
        label: "nb_utilisateurs_univ_Artois",
        data: JSONdata.data.Nb_utilisateurs_modeTransport_univ_Art.data,
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
      },
      {
        label: "nb_utilisateurs_univ_valencienne",
        data: JSONdata.data.Nb_utilisateurs_modeTransport_univ_Val.data,
        backgroundColor: [ 'rgba(75, 192, 192, 0.2)'],
      }
    ]
    }
    
    const config = {
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
  
    const mygraph = new Chart(
      document.getElementById('mygraph'), 
      config
    );
  })



   
