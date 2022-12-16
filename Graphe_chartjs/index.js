const API_URL = "http://127.0.0.1:8000/mode_transport_univ"
fetch(API_URL) 
   .then(res => res.json())         //recupère données format json qui sera ensuite appélé JSONdata         
   .then( JSONdata => {

      //lier les boutons créer dans le fichier html au fichier javascript
      const mode_transport_univ = document.getElementById('mode_transport_univ');
      mode_transport_univ.addEventListener('click', change_mode_transport_univ)
   
      const pourcent_mode_transport_univ  = document.getElementById('pourcent_mode_transport_univ');
      pourcent_mode_transport_univ .addEventListener('click', change_pourcent_mode_transport_univ )

      const nb_person_univ = document.getElementById('nb_person_univ');
      nb_person_univ.addEventListener('click', change_nb_person_univ)


      const autocolors = window['chartjs-plugin-autocolors']; // génération de couleurs automatique pour les différents graphiques
      Chart.register(autocolors);  //Enregistrement de tous les graphes
      const lighten = (color, value) => Chart.helpers.color(color).lighten(value).rgbString();
       
      // données creation graphique mode transport pour chaque univ
      console.log(JSONdata.data)
      const liste_univ  = JSONdata.data.map(
        function(index){  //considère tous ensemble data st des index, pour chaque index recurepère clé
          return Object.keys(index)[0]; // Object.keys(index) retourne les differents label sous forme de liste,  [0] permet de récupérer la valeur
        }) 
      console.log(liste_univ)  
      
      const donnee  = JSONdata.data.map( index => {
          return Object.values(index)[0];  //parcours une liste d'ensemble(dictionnaire) et recupère les valeurs
        })
      console.log(donnee) 
      
      const labels = Object.keys(donnee[0]) ////recupère clés d'un ensemble(dictionnaire) sous forme de liste
      console.log(labels) 

      //Recupération données pour chaque université
      const liste_data = donnee.map( index => {
          return Object.values(index);
        }) 
      console.log(liste_data)

      //calcul donnée pour toutes les universités(global), somme sur les modes de transport
      var data_global = []
      total = 0; 
      for (let j=0; j<Object.values(donnee[0]).length; j++){
          for(let i=0; i<donnee.length; i++) {
              total +=  Object.values(donnee[i])[j]
          } 
          data_global.push(total) 
          total = 0 
      }
      console.log(data_global)

      
      var datasets = []  // def datasets contruire data
      d_glob = { label: "Nb_utilisateurs_global", data: data_global }
      datasets.push(d_glob)
      for (let i = 0; i < JSONdata.data.length ; i++) {
        const data = { label : liste_univ[i], data: liste_data[i] }
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
              offset: 0, 
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
      const labels2 = liste_univ
      labels2.push("Nb_utilisateur_global")
      const label = labels
      
      var liste_sum= []     //somme nb_utilisateur mode transport par univ(nb_personne par université)
      sum = 0
      for(let i=0; i<donnee.length; i++){
        for (let j=0; j<Object.values(donnee[0]).length; j++){
           sum += Object.values(donnee[i])[j]
        }
        liste_sum.push(sum)
        sum = 0
      }
      console.log(liste_sum)

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
      console.log(liste_val)


      var datasets = []  
      util_total  = 0   //nb_utilisateur total
      for(let i=0; i<liste_sum.length; i++){
        util_total += liste_sum[i]
      }
      console.log(util_total)

      var liste_sum_pourcent = []     //somme pourcentage differents mode transport pour univ(global)
      for(let i=0; i<data_global.length; i++){
          let sum_pourcent = (data_global[i]/util_total)*100
          sum_pourcent = sum_pourcent.toFixed(1);
          liste_sum_pourcent.push(sum_pourcent)
      }
      console.log(liste_sum_pourcent) 

      for (let i=0; i<liste_sum_pourcent.length; i++){  //rajout de la valeur pourcent global dans listes contenues dans liste_val
         liste_val[i].push(liste_sum_pourcent[i])  
      }
      console.log(liste_val)

      for (let i = 0; i < label.length ; i++) {
        const data = { label : label[i], data: liste_val[i]}
        datasets.push(data)
      }
      console.log(datasets)
    
      const data2 = {   
        labels: labels2,
        datasets
      } 

  
      // données création du graphique nb personne par université: utilisation liste_sum, liste_univ calculé plus haut
      const data3 = {   
        labels: liste_univ,
        datasets: [{
          label: "Nb_person_université",
          data: liste_sum,
        }]
      }
      
      // Création des fonctions pour passer d'un graphe a un autre grace a une mise a jour
      function change_mode_transport_univ(){
          const updatetype ="bar";
          myChart.config.type = updatetype
          myChart.config.data = data1
          myChart.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université"
          myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':'+ ' ' + context.raw  } 
          myChart.config.options.plugins.autocolors.mode = "data"
          myChart.config.options.plugins.autocolors.offset = 0
          myChart.config.options.scales.x.display = true
          myChart.config.options.scales.y.display = true
          myChart.config.options.scales.x.stacked = false
          myChart.config.options.scales.y.stacked = false
          myChart.config.options.scales.y.ticks.callback = (value) => {return value }
          myChart.update()
        }
  
      function change_pourcent_mode_transport_univ(){
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
  
      function change_nb_person_univ(){
          const updatetype ="pie";
          myChart.config.type = updatetype
          myChart.config.data = data3
          myChart.config.options.plugins.title.text = "Nombre de personne par université"
          myChart.config.options.plugins.autocolors.mode = "data"  //an array of colors, equivalent to the length of data is provided for each dataset(par defaut)
          myChart.config.options.plugins.autocolors.offset = 1 // //used to offset the color generation by a number of colors
          myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':'+ ' ' + context.raw } 
          myChart.config.options.scales.x.display = false
          myChart.config.options.scales.y.display = false
          myChart.update()
        }
      

  })


 
   
