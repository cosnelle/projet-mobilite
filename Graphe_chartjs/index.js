const API_URL = "http://127.0.0.1:8000/Nombre_mode_transport_univ"
fetch(API_URL) 
   .then(res => res.json())         //recupère données format json qui sera ensuite appélé JSONdata         
   .then( JSONdata => {

      //lier les boutons créer dans le fichier html au fichier javascript

      const person_univ_nombre = document.getElementById('person_univ_nombre');
      person_univ_nombre.addEventListener('click', change_person_univ_nombre)

      const person_univ_pourcent = document.getElementById('person_univ_pourcent');
      person_univ_pourcent.addEventListener('click', change_person_univ_pourcent)

      const mode_transport_univ_nombre = document.getElementById('mode_transport_univ_nombre');
      mode_transport_univ_nombre.addEventListener('click', change_mode_transport_univ_nombre)
   
      const mode_transport_univ_pourcent  = document.getElementById('mode_transport_univ_pourcent');
      mode_transport_univ_pourcent.addEventListener('click', change_mode_transport_univ_pourcent )

      const mode_transport_univ_nombre2  = document.getElementById('mode_transport_univ_nombre2');
      mode_transport_univ_nombre2.addEventListener('click', change_mode_transport_univ_nombre2 ) 

      
    
      const autocolors = window['chartjs-plugin-autocolors']; // génération de couleurs automatique pour les différents graphiques
      Chart.register(autocolors);  //Enregistrement de tous les graphes
      const lighten = (color, value) => Chart.helpers.color(color).lighten(value).rgbString();

       
      // données creation graphique mode transport pour chaque univ(representation1)
      const liste_univ  = JSONdata.data.map(
        function(index){  //considère tous ensemble data st des index, pour chaque index recurepère clé
          return Object.keys(index)[0]; // Object.keys(index) retourne les differents label sous forme de liste,  [0] permet de récupérer la valeur
        }) 
 
      const donnee  = JSONdata.data.map( index => {
          return Object.values(index)[0];  //parcours une liste d'ensemble(dictionnaire) et recupère les valeurs
        })

      const mode_transport = Object.keys(donnee[0]) ////recupère clés d'un ensemble(dictionnaire) sous forme de liste
  
      //Recupération données pour chaque université
      const liste_data = donnee.map( index => {
          return Object.values(index);
        }) 

     //Recupération données pour chaque mode de transport
      var value_list =  []   
      var liste_value_list = []
      for (let j=0; j<Object.values(donnee[0]).length; j++){
          for(let i=0; i<donnee.length; i++) {
              let value = (Object.values(donnee[i])[j])
              value_list.push(value)
          } 
          liste_value_list.push(value_list) 
          value_list = []
      }

      var datasets = []  // def datasets contruire data
      for (let i = 0; i < mode_transport.length ; i++) {
        const data = { label : mode_transport[i], data: liste_value_list[i] }
        datasets.push(data)
      }
    
      const data1 = {   // def data pour construire config
        labels: liste_univ,
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
                top: 10, //espace avant titre
                bottom: 30   //espace après le titre
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return context.dataset.label + ':' + ' ' + context.parsed.y 
                }      
              }
            }, 
            autocolors: {
              offset: 1, 
              customize(context) {
                const colors = context.colors
                return {
                  background: lighten(colors.background, 0.2),
                };
              }
            },
          scales: {
            x: {
                display: true,
            },
            y: {  
                display: true,          
            }
           },
          },
        }
      };
  
      const myChart = new Chart(  // creation du graphe
        document.getElementById('myChart'), 
        config
      );


      

      // données creation du graphe a barre cumulé avec pourcentage mode transport par univ
      const labels2  = []
      for(let i=0; i<liste_univ.length; i++){
       labels2.push(liste_univ[i])
      }
      labels2.push("Nb_utilisateur_global")
      const label = mode_transport
      
      var liste_sum= []     //somme nb_utilisateur mode transport par univ(nb_personne par université)
      sum = 0
      for(let i=0; i<donnee.length; i++){
        for (let j=0; j<Object.values(donnee[0]).length; j++){
           sum += Object.values(donnee[i])[j]
        }
        liste_sum.push(sum)
        sum = 0
      }

      var val =  []   //calcul pourcentage nb_utilisateur mode transport par univ
      var liste_val = []
      for (let j=0; j<Object.values(donnee[0]).length; j++){
          for(let i=0; i<donnee.length; i++) {
              let value = (Object.values(donnee[i])[j]/liste_sum[i])*100
              value = value.toFixed(1);
              val.push(value)
          } 
          liste_val.push(val) 
          val = []
      }
  
      var datasets = [] 

      util_total  = 0   //nb_utilisateur total
      for(let i=0; i<liste_sum.length; i++){
        util_total += liste_sum[i]
      }
 
      var data_global = []
      total = 0; 
      for (let j=0; j<Object.values(donnee[0]).length; j++){
          for(let i=0; i<donnee.length; i++) {
              total +=  Object.values(donnee[i])[j]
          } 
          data_global.push(total) 
          total = 0 
      }
  
      var liste_sum_pourcent = []     //somme pourcentage differents mode transport pour univ(global)
      for(let i=0; i<data_global.length; i++){
          let sum_pourcent = (data_global[i]/util_total)*100
          sum_pourcent = sum_pourcent.toFixed(1);
          liste_sum_pourcent.push(sum_pourcent)
      }

      for (let i=0; i<liste_sum_pourcent.length; i++){  //rajout de la valeur pourcent global dans listes contenues dans liste_val
         liste_val[i].push(liste_sum_pourcent[i])  
      }

      for (let i = 0; i < label.length ; i++) {
        const data = { label : label[i], data: liste_val[i]}
        datasets.push(data)
      }
    
      const data2 = {   
        labels: labels2,
        datasets
      } 


      // données creation du graphe mode transport par univ (représentation2)
      datasets=[]
      for (let i = 0; i < liste_univ.length ; i++) {
        const data = { label : liste_univ[i], data: liste_data[i]}
        datasets.push(data)
      }
        
      const data5 = {   
        labels: mode_transport,
        datasets
      } 


      // données création du graphique répartition personnes par université: utilisation liste_sum, liste_univ calculé plus haut

      //calcul pourcentage
      var liste_pourcent = []    
      for(let i=0; i<liste_sum.length; i++){
          let calcul_pourcent = (liste_sum[i]/util_total)*100
          calcul_pourcent = calcul_pourcent.toFixed(1);
          liste_pourcent.push(calcul_pourcent)
      }

      const data4 = {   
        labels: liste_univ,
        datasets: [{
          data: liste_pourcent,
        }]
      }
      

      const data3 = {   
        labels: liste_univ,
        datasets: [{
          label : "Nb_utilisateur_univ",
          data: liste_sum,
        }]
      }

      
      // Création des fonctions pour passer d'un graphe a un autre grace a une mise a jour
      
      function change_person_univ_nombre(){
        const updatetype ="bar";
        myChart.config.type = updatetype
        myChart.config.data = data3
        myChart.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université"
        myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return "Nb_utilisateur" + ':'+ ' ' + context.raw  } 
        myChart.config.options.plugins.autocolors.mode = "data"
        myChart.config.options.plugins.autocolors.offset = 0
        myChart.config.options.scales.x.display = true
        myChart.config.options.scales.y.display = true
        myChart.config.options.scales.x.stacked = false
        myChart.config.options.scales.y.stacked = false
        myChart.config.options.scales.y.ticks.callback = (value) => {return value }
        myChart.update()
      }

      function change_person_univ_pourcent(){
        const updatetype ="pie";
        myChart.config.type = updatetype
        myChart.config.data = data4
        myChart.config.options.plugins.title.text = "Répartition des personnes par université"
        myChart.config.options.plugins.autocolors.mode = "data"  //an array of colors, equivalent to the length of data is provided for each dataset(par defaut)
        myChart.config.options.plugins.autocolors.offset = 1 // //used to offset the color generation by a number of colors
        myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.label + ':'+ ' ' + context.raw   + '%'} 
        myChart.config.options.scales.x.display = false
        myChart.config.options.scales.y.display = false
        myChart.update()
      }
      
      function change_mode_transport_univ_nombre(){
          const updatetype ="bar";
          myChart.config.type = updatetype
          myChart.config.data = data1
          myChart.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université"
          myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':'+ ' ' + context.raw  } 
          myChart.config.options.plugins.autocolors.mode = "data"
          myChart.config.options.plugins.autocolors.offset = 1
          myChart.config.options.scales.x.display = true
          myChart.config.options.scales.y.display = true
          myChart.config.options.scales.x.stacked = false
          myChart.config.options.scales.y.stacked = false
          myChart.config.options.scales.y.ticks.callback = (value) => {return value }
          myChart.update()
        }

        function change_mode_transport_univ_pourcent(){
          const updatetype ="bar";
          myChart.config.type = updatetype
          myChart.config.data = data2
          myChart.config.options.plugins.title.text = "Pourcentage mode de transport par université"
          myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' }   
          myChart.config.options.plugins.autocolors.mode = "dataset"  // a new color is picked for each dataset 
          myChart.config.options.plugins.autocolors.offset = 1
          myChart.config.options.scales.x.display = true
          myChart.config.options.scales.y.display = true
          myChart.config.options.scales.x.stacked = true
          myChart.config.options.scales.y.stacked = true
          myChart.config.options.scales.y.beginAtZero = true
          myChart.config.options.scales.y.ticks.callback = (value) => {return value + '%'} //ajout pourcentage axe absicesse
          myChart.config.options.responsive = true 
          myChart.update()
        } 


      function change_mode_transport_univ_nombre2(){
          const updatetype ="bar";
          myChart.config.type = updatetype
          myChart.config.data = data5
          myChart.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université"
          myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y }   
          myChart.config.options.plugins.autocolors.mode = "dataset"  // a new color is picked for each dataset 
          myChart.config.options.plugins.autocolors.offset = 1  
          myChart.config.options.scales.x.display = true
          myChart.config.options.scales.y.display = true
          myChart.config.options.scales.x.stacked = true
          myChart.config.options.scales.y.stacked = true
          myChart.config.options.scales.y.beginAtZero = true
          myChart.config.options.scales.y.ticks.callback = (value) => {return value } //ajout pourcentage axe absicesse
          myChart.config.options.responsive = true 
          myChart.update()
        }  
  })



  /********  graphe Distance *******/

  const API_URL2 = "http://127.0.0.1:8000/Distance_mode_transport_univ_km"
  fetch(API_URL2) 
     .then(res => res.json())         //recupère données format json qui sera ensuite appélé JSONdata         
     .then( JSONdata => {
  
        //lier les boutons créer dans le fichier html au fichier javascript
  
        const Distance_mode_transport_univ= document.getElementById('Distance_mode_transport_univ');
        Distance_mode_transport_univ.addEventListener('click', change_Distance_mode_transport_univ)
     
        const Distance_mode_transport_univ_pourcent2  = document.getElementById('Distance_mode_transport_univ_pourcent2');
        Distance_mode_transport_univ_pourcent2.addEventListener('click', change_Distance_mode_transport_univ_pourcent2 )
  
        const Distance_mode_transport_univ_pourcent  = document.getElementById('Distance_mode_transport_univ_pourcent');
        Distance_mode_transport_univ_pourcent.addEventListener('click', change_Distance_mode_transport_univ_pourcent )
  
        const autocolors = window['chartjs-plugin-autocolors']; // génération de couleurs automatique pour les différents graphiques
        Chart.register(autocolors);  //Enregistrement de tous les graphes
        const lighten = (color, value) => Chart.helpers.color(color).lighten(value).rgbString();
  
         
        // données creation graphique mode transport pour chaque univ(representation1)
        const liste_univ  = JSONdata.data.map(
          function(index){  //considère tous ensemble data st des index, pour chaque index recurepère clé
            return Object.keys(index)[0]; // Object.keys(index) retourne les differents label sous forme de liste,  [0] permet de récupérer la valeur
          }) 

        
        const donnee  = JSONdata.data.map( index => {
            return Object.values(index)[0];  //parcours une liste d'ensemble(dictionnaire) et recupère les valeurs
          })
        
        const mode_transport = Object.keys(donnee[0]) ////recupère clés d'un ensemble(dictionnaire) sous forme de liste
  
        //Recupération données pour chaque université
        const liste_data = donnee.map( index => {
            return Object.values(index);
          }) 
  
       //Recupération données pour chaque mode de transport
        var value_list =  []   
        var liste_value_list = []
        for (let j=0; j<Object.values(donnee[0]).length; j++){
            for(let i=0; i<donnee.length; i++) {
                let value = (Object.values(donnee[i])[j])
                value_list.push(value)
            } 
            liste_value_list.push(value_list) 
            value_list = []
        }
  
        var datasets = []  // def datasets contruire data
        for (let i = 0; i < mode_transport.length ; i++) {
          const data = { label : mode_transport[i], data: liste_value_list[i] }
          datasets.push(data)
        }
      
        const data1 = {   // def data pour construire config
          labels: liste_univ,
          datasets
        } 
  
        const config = { // def config pour créer le graphe
          type: 'bar',
          data: data1,
          options : {
            plugins: {        
              title: {
                display: true,
                text: 'Distance (en km) mode de transport par université',
                padding: {
                  top: 130, //espace avant titre
                  bottom: 20   //espace après le titre
                }
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return context.dataset.label + ':' + ' ' + context.parsed.y 
                  }      
                }
              }, 
              autocolors: {
                offset: 1, 
                customize(context) {
                  const colors = context.colors
                  return {
                    background: lighten(colors.background, 0.2),
                  };
                }
              },
            scales: {
              x: {
                  display: true,
              },
              y: {  
                  display: true,          
              }
             },
            },
          }
        };
    
         
        const myChart2 = new Chart(  // creation du graphe
        document.getElementById('myChart2'), 
        config
        );

  
        // données creation du graphe a barre cumulé avec pourcentage Distance mode transport par univ
        const labels2  = []
        for(let i=0; i<liste_univ.length; i++){
         labels2.push(liste_univ[i])
        }
        labels2.push("Nb_utilisateur_global")
        const label = mode_transport
        
        var liste_sum= []     //somme Distance mode transport par univ(Distance total par université)
        sum = 0
        for(let i=0; i<donnee.length; i++){
          for (let j=0; j<Object.values(donnee[0]).length; j++){
             sum += Object.values(donnee[i])[j]
          }
          liste_sum.push(sum)
          sum = 0
        }
  
        var val =  []   //calcul pourcentage Distance parcourue mode transport par univ
        var liste_val = []
        for (let j=0; j<Object.values(donnee[0]).length; j++){
            for(let i=0; i<donnee.length; i++) {
                let value = (Object.values(donnee[i])[j]/liste_sum[i])*100
                value = value.toFixed(1);
                val.push(value)
            } 
            liste_val.push(val) 
            val = []
        }
  
        var datasets = [] 
        util_total  = 0   //Distance total pour toutes université
        for(let i=0; i<liste_sum.length; i++){
          util_total += liste_sum[i]
        }

        //somme distance mode transport pour les univ
        var data_global = []
        total = 0; 
        for (let j=0; j<Object.values(donnee[0]).length; j++){
            for(let i=0; i<donnee.length; i++) {
                total +=  Object.values(donnee[i])[j]
            } 
            data_global.push(total) 
            total = 0 
        }
     

        var liste_sum_pourcent = []     //pourcentage differents mode transport (global)
        for(let i=0; i<data_global.length; i++){
            let sum_pourcent = (data_global[i]/util_total)*100
            sum_pourcent = sum_pourcent.toFixed(1);
            liste_sum_pourcent.push(sum_pourcent)
        }
   
        for (let i=0; i<liste_sum_pourcent.length; i++){  //rajout de la valeur pourcent global dans listes contenues dans liste_val
           liste_val[i].push(liste_sum_pourcent[i])  
        }
      
        for (let i = 0; i < label.length ; i++) {
          const data = { label : label[i], data: liste_val[i]}
          datasets.push(data)
        }
      
        const data2 = {   
          labels: labels2,
          datasets
        } 

  
        // données creation du graphe Distance univ (représentation2)
       
         // données creation du graphe  pourcentage Distance mode transport par univ(représentation2)
         var value_list =  []   
         var liste_value_list = []
         for (let j=0; j<Object.values(donnee[0]).length; j++){
             for(let i=0; i<donnee.length; i++) {
                 let value = (Object.values(donnee[i])[j]/liste_sum[i])*100
                 value  = value.toFixed(1);
                 value_list.push(value)
             } 
             liste_value_list.push(value_list) 
             value_list = []
         }
   
         var datasets = []  // def datasets contruire data
         for (let i = 0; i < mode_transport.length ; i++) {
           const data = { label : mode_transport[i], data: liste_value_list[i] }
           datasets.push(data)
         }
       
         const data3 = {   // def data pour construire config
           labels: liste_univ,
           datasets
         }  
    

        // Création des fonctions pour passer d'un graphe a un autre grace a une mise a jour
        function change_Distance_mode_transport_univ(){
            const updatetype ="bar";
            myChart2.config.type = updatetype
            myChart2.config.data = data1
            myChart2.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université"
            myChart2.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':'+ ' ' + context.raw  } 
            myChart2.config.options.plugins.autocolors.mode = "data"
            myChart2.config.options.plugins.autocolors.offset = 0
            myChart2.config.options.scales.x.display = true
            myChart2.config.options.scales.y.display = true
            myChart2.config.options.scales.x.stacked = false
            myChart2.config.options.scales.y.stacked = false
            myChart2.config.options.scales.y.ticks.callback = (value) => {return value }
            myChart2.config.options.responsive = true
            myChart2.update()
          }
  
          function change_Distance_mode_transport_univ_pourcent2(){
            const updatetype ="bar";
            myChart2.config.type = updatetype
            myChart2.config.data = data2
            myChart2.config.options.plugins.title.text = "Pourcentage Distance Totale (en km) mode de transport par université'"
            myChart2.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' }   
            myChart2.config.options.plugins.autocolors.mode = "dataset"  // a new color is picked for each dataset 
            myChart2.config.options.plugins.autocolors.offset = 1
            myChart2.config.options.scales.x.display = true
            myChart2.config.options.scales.y.display = true
            myChart2.config.options.scales.x.stacked = true
            myChart2.config.options.scales.y.stacked = true
            myChart2.config.options.scales.y.beginAtZero = true
            myChart2.config.options.scales.y.ticks.callback = (value) => {return value + '%'} //ajout pourcentage axe absicesse
            myChart2.config.options.responsive = true 
            myChart2.update()
          }    

          function change_Distance_mode_transport_univ_pourcent(){
            const updatetype ="bar";
            myChart2.config.type = updatetype
            myChart2.config.data = data3
            myChart2.config.options.plugins.title.text = "Pourcentage Distance Totale (en km) mode de transport par université'"
            myChart2.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' }   
            myChart2.config.options.plugins.autocolors.mode = "dataset"  // a new color is picked for each dataset 
            myChart2.config.options.plugins.autocolors.offset = 1
            myChart2.config.options.scales.x.display = true
            myChart2.config.options.scales.y.display = true
            myChart2.config.options.scales.x.stacked = false
            myChart2.config.options.scales.y.stacked = false
            myChart2.config.options.scales.y.beginAtZero = true
            myChart2.config.options.scales.y.ticks.callback = (value) => {return value + '%'} //ajout pourcentage axe absicesse
            myChart2.config.options.responsive = true 
            myChart2.update()
          }    
    })
  
  
    
  /********  graphe Co2 *******/
    
  const API_URL3 = "http://127.0.0.1:8000/Emission_Co2_mode_transport_univ_kgCo2"
  fetch(API_URL3) 
     .then(res => res.json())         //recupère données format json qui sera ensuite appélé JSONdata         
     .then( JSONdata => {
  
        //lier les boutons créer dans le fichier html au fichier javascript
  
        const Co2_mode_transport_univ= document.getElementById('Co2_mode_transport_univ');
        Co2_mode_transport_univ.addEventListener('click', change_Co2_mode_transport_univ)
     
        const Co2_mode_transport_univ_pourcent  = document.getElementById('Co2_mode_transport_univ_pourcent');
        Co2_mode_transport_univ_pourcent.addEventListener('click', change_Co2_mode_transport_univ_pourcent )

        const Co2_mode_transport_univ_pourcent2  = document.getElementById('Co2_mode_transport_univ_pourcent2');
        Co2_mode_transport_univ_pourcent2.addEventListener('click', change_Co2_mode_transport_univ_pourcent2 )
        
        
        
        const autocolors = window['chartjs-plugin-autocolors']; // génération de couleurs automatique pour les différents graphiques
        Chart.register(autocolors);  //Enregistrement de tous les graphes
        const lighten = (color, value) => Chart.helpers.color(color).lighten(value).rgbString();
  
         
        // données creation graphique mode transport pour chaque univ
        const liste_univ  = JSONdata.data.map(
          function(index){  //considère tous ensemble data st des index, pour chaque index recurepère clé
            return Object.keys(index)[0]; // Object.keys(index) retourne les differents label sous forme de liste,  [0] permet de récupérer la valeur
          }) 
        
        const donnee  = JSONdata.data.map( index => {
            return Object.values(index)[0];  //parcours une liste d'ensemble(dictionnaire) et recupère les valeurs
          })
        
        const mode_transport = Object.keys(donnee[0]) ////recupère clés d'un ensemble(dictionnaire) sous forme de liste
    
        //Recupération données pour chaque université
        const liste_data = donnee.map( index => {
            return Object.values(index);
          }) 
  
       //Recupération données pour chaque mode de transport
        var value_list =  []   
        var liste_value_list = []
        for (let j=0; j<Object.values(donnee[0]).length; j++){
            for(let i=0; i<donnee.length; i++) {
                let value = (Object.values(donnee[i])[j])
                value_list.push(value)
            } 
            liste_value_list.push(value_list) 
            value_list = []
        }
  
        var datasets = []  // def datasets contruire data
        for (let i = 0; i < mode_transport.length ; i++) {
          const data = { label : mode_transport[i], data: liste_value_list[i] }
          datasets.push(data)
        }
      
        const data1 = {   // def data pour construire config
          labels: liste_univ,
          datasets
        } 
  
        const config = { // def config pour créer le graphe
          type: 'bar',
          data: data1,
          options : {
            plugins: {        
              title: {
                display: true,
                text: 'Distance (en km) mode de transport par université',
                padding: {
                  top: 140, //espace avant titre
                  bottom: 20   //espace après le titre
                }
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return context.dataset.label + ':' + ' ' + context.parsed.y 
                  }      
                }
              }, 
              autocolors: {
                offset: 1, 
                customize(context) {
                  const colors = context.colors
                  return {
                    background: lighten(colors.background, 0.2),
                  };
                }
              },
            scales: {
              x: {
                  display: true,
              },
              y: {  
                  display: true,          
              }
             },
            },
          }
        };
    
         
        const myChart3 = new Chart(  // creation du graphe
        document.getElementById('myChart3'), 
        config
        );

  
        // données creation du graphe a barre cumulé avec pourcentage Distance mode transport par univ
        const labels2  = []
        for(let i=0; i<liste_univ.length; i++){
         labels2.push(liste_univ[i])
        }
        labels2.push("Nb_utilisateur_global")
        const label = mode_transport
        
        var liste_sum= []     //somme Distance mode transport par univ(Distance total par université)
        sum = 0
        for(let i=0; i<donnee.length; i++){
          for (let j=0; j<Object.values(donnee[0]).length; j++){
             sum += Object.values(donnee[i])[j]
          }
          liste_sum.push(sum)
          sum = 0
        }
  
        var val =  []   //calcul pourcentage Distance parcourue mode transport par univ
        var liste_val = []
        for (let j=0; j<Object.values(donnee[0]).length; j++){
            for(let i=0; i<donnee.length; i++) {
                let value = (Object.values(donnee[i])[j]/liste_sum[i])*100
                value = value.toFixed(1);
                val.push(value)
            } 
            liste_val.push(val) 
            val = []
        }

        var datasets = [] 
        util_total  = 0   //Distance total pour toutes université
        for(let i=0; i<liste_sum.length; i++){
          util_total += liste_sum[i]
        }
  
        //somme distance mode transport pour les univ
        var data_global = []
        total = 0; 
        for (let j=0; j<Object.values(donnee[0]).length; j++){
            for(let i=0; i<donnee.length; i++) {
                total +=  Object.values(donnee[i])[j]
            } 
            data_global.push(total) 
            total = 0 
        }
    
        var liste_sum_pourcent = []     //pourcentage differents mode transport (global)
        for(let i=0; i<data_global.length; i++){
            let sum_pourcent = (data_global[i]/util_total)*100
            sum_pourcent = sum_pourcent.toFixed(1);
            liste_sum_pourcent.push(sum_pourcent)
        }
  
        for (let i=0; i<liste_sum_pourcent.length; i++){  //rajout de la valeur pourcent global dans listes contenues dans liste_val
           liste_val[i].push(liste_sum_pourcent[i])  
        }
  
        for (let i = 0; i < label.length ; i++) {
          const data = { label : label[i], data: liste_val[i]}
          datasets.push(data)
        }
      
        const data2 = {   
          labels: labels2,
          datasets
        } 
    
        // données creation du graphe  pourcentage Distance mode transport par univ(représentation2)
        var value_list =  []   
        var liste_value_list = []
        for (let j=0; j<Object.values(donnee[0]).length; j++){
            for(let i=0; i<donnee.length; i++) {
                let value = (Object.values(donnee[i])[j]/liste_sum[i])*100
                value  = value.toFixed(1);
                value_list.push(value)
            } 
            liste_value_list.push(value_list) 
            value_list = []
        }
  
        var datasets = []  // def datasets contruire data
        for (let i = 0; i < mode_transport.length ; i++) {
          const data = { label : mode_transport[i], data: liste_value_list[i] }
          datasets.push(data)
        }
      
        const data3 = {   // def data pour construire config
          labels: liste_univ,
          datasets
        }  
  

        // Création des fonctions pour passer d'un graphe a un autre grace a une mise a jour
        
        function change_Co2_mode_transport_univ(){
            const updatetype ="bar";
            myChart3.config.type = updatetype
            myChart3.config.data = data1
            myChart3.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université"
            myChart3.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':'+ ' ' + context.raw  } 
            myChart3.config.options.plugins.autocolors.mode = "data"
            myChart3.config.options.plugins.autocolors.offset = 1
            myChart3.config.options.scales.x.display = true
            myChart3.config.options.scales.y.display = true
            myChart3.config.options.scales.x.stacked = false
            myChart3.config.options.scales.y.stacked = false
            myChart3.config.options.scales.y.ticks.callback = (value) => {return value }
            myChart3.config.options.responsive = true
            myChart3.update()
          }
  
          function change_Co2_mode_transport_univ_pourcent2(){
            const updatetype ="bar";
            myChart3.config.type = updatetype
            myChart3.config.data = data2
            myChart3.config.options.plugins.title.text = "Pourcentage Distance Totale (en km) mode de transport par université'"
            myChart3.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' }   
            myChart3.config.options.plugins.autocolors.mode = "dataset"  // a new color is picked for each dataset 
            myChart3.config.options.plugins.autocolors.offset = 1
            myChart3.config.options.scales.x.display = true
            myChart3.config.options.scales.y.display = true
            myChart3.config.options.scales.x.stacked = true
            myChart3.config.options.scales.y.stacked = true
            myChart3.config.options.scales.y.beginAtZero = true
            myChart3.config.options.scales.y.ticks.callback = (value) => {return value + '%'} //ajout pourcentage axe absicesse
            myChart3.config.options.responsive = true 
            myChart3.update()
          }    

          function change_Co2_mode_transport_univ_pourcent(){
            const updatetype ="bar";
            myChart3.config.type = updatetype
            myChart3.config.data = data3
            myChart3.config.options.plugins.title.text = "Pourcentage Distance Totale (en km) mode de transport par université'"
            myChart3.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' }   
            myChart3.config.options.plugins.autocolors.mode = "dataset"  // a new color is picked for each dataset 
            myChart3.config.options.plugins.autocolors.offset = 1
            myChart3.config.options.scales.x.display = true
            myChart3.config.options.scales.y.display = true
            myChart3.config.options.scales.x.stacked = false
            myChart3.config.options.scales.y.stacked = false
            myChart3.config.options.scales.y.beginAtZero = true
            myChart3.config.options.scales.y.ticks.callback = (value) => {return value + '%'} //ajout pourcentage axe absicesse
            myChart3.config.options.responsive = true 
            myChart3.update()
          }
    })
  
  
    