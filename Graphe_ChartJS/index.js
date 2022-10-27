const API_URL = "http://127.0.0.1:8000/data_aggregation"
fetch(API_URL) 
   .then(res => res.json())         //recupère données format json           
   .then(JSONdata => JSONdata.data.Nb_utilisateurs_modeTransport) //données récupérées sont stockées dans JSONdata
   .then(function(Nb_utilisateurs_modeTransport) { 
    const data = {
      labels: Nb_utilisateurs_modeTransport.labels,
      datasets: [{
        label: Nb_utilisateurs_modeTransport.label,
        data: Nb_utilisateurs_modeTransport.data,
        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
      }]
    }

    const config = {
      type: 'bar',
      data,
      options : {
        plugins: {
          title: {
            display: true,
            text: 'Nombre d utilisateur mode de transport',
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

  
