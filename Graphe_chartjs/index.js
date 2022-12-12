const API_URL = "http://127.0.0.1:8000/data_aggregation"
fetch(API_URL) 
   .then(res => res.json())         //recupère données format json qui sera ensuite appélé JSONdata         
   .then( JSONdata => {
      
      //lier les boutons de id mode_transport_univ et nb_person_univ créer dans le fichier html au fichier javascript
      const mode_transport_univ = document.getElementById('mode_transport_univ');
      mode_transport_univ.addEventListener('click', change_mode_transport_univ)
   
      const nb_person_univ = document.getElementById('nb_person_univ');
      nb_person_univ.addEventListener('click', change_nb_person_univ)

      
      // creation du graphe mode_transport_univ

      //Recupération données pour tous les universités
      const labels  = JSONdata.data.Nb_utilisateurs_modeTransport_global.map(
      function(index){
        return Object.keys(index)[0]; // Object.keys(index) retourne une liste contenant un label [0] permet de récupérer la valeur
      })

      const data_global = JSONdata.data.Nb_utilisateurs_modeTransport_global.map(
      function(index){
        return Object.values(index)[0];
      }) 
  
      console.log(labels)
      console.log(data_global)

      //Recupération données pour chaque université
      const liste_data = Array(JSONdata.data.Nb_utilisateurs_modeTransport_univ.length).map(e => Array(JSONdata.data.Nb_utilisateurs_modeTransport_univ.length).fill("none")); //cree liste vide taille nombre de groupe
      for (let i = 0; i < JSONdata.data.Nb_utilisateurs_modeTransport_univ.length ; i++) {
        const tab = JSONdata.data.Nb_utilisateurs_modeTransport_univ[i].map(index => Object.values(index)[1]) //[1] permet de recupérer Nb_utilisateur pour chaque groupe
        liste_data[i] = tab
      }
      console.log(liste_data)

      list_color = [['rgba(255, 205, 86, 0.2)'],  ['rgba(255, 99, 132, 0.2)'] , [ 'rgba(75, 192, 192, 0.2)'], ['rgba(54, 162, 235, 0.2)'] ]  // jaune, rouge, bleu clair, bleu
  
      datasets = []  // def datasets contruire data
      d_glob = { label: "Nb_utilisateurs_global", data: data_global, backgroundColor: ['rgba(54, 162, 235, 0.2)'] }
      datasets.push(d_glob)
      for (let i = 0; i < JSONdata.data.nb_univ ; i++) {
        const data = { label : JSONdata.data.Nb_utilisateurs_modeTransport_univ[i][0].Université, data: liste_data[i], backgroundColor: list_color[i]  }
        datasets.push(data)
      }

      console.log(datasets)
    
      const data1 = {   // def data pour construire config
        labels: labels,
        datasets
     }

      const config = { // def config pour créer le graphe
        type: 'bar',
        data: data1,
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
  
      const myChart = new Chart(  // creation du graphe
        document.getElementById('myChart'), 
        config
      );

    
      // données creation du graphe nb_person_univ

       //Recupération données nombre personne pour tous les universités
      const labels2  = JSONdata.data.nb_person_univ.map(
        function(index){
          return Object.keys(index)[0]; // Object.keys(index) retourne une liste contenant un label [0] permet de récupérer la valeur
         })

      const data_nb_person = JSONdata.data.nb_person_univ.map(
        function(index){
          return Object.values(index)[0];
        }) 
  
      console.log(labels2)
      console.log(data_nb_person)

  
      const data2 = {   // def data pour construire config
        labels: labels2,
        datasets: [{
          label: "Nb_person_université",
          data: data_nb_person,
          backgroundColor: ['rgba(255, 205, 86, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'] 
        }]
      }
    
      // Creéation des fonctions pour passer d'une graphe a un autre grace a une mise a jour
      function change_mode_transport_univ(){
        const updatetype ="bar";
        myChart.config.type = updatetype
        myChart.config.data = data1
        myChart.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université"
        myChart.update()
      }

      function change_nb_person_univ(){
        const updatetype ="pie";
        myChart.config.type = updatetype
        myChart.config.data = data2
        myChart.config.options.plugins.title.text = "Nombre de personne par université"
        myChart.update()
      }

  
  })


 
   
