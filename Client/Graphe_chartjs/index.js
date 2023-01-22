
         /* Projet Ingenieur PolytechLille  
            Annees universitaire 2022-2023
            Contributeurs : Cosnelle DJOUMEKOUM & Julie RIDOLFI */


var hostname ="127.0.0.1";
const API_URL = "http://"+hostname+":8000/nombre_mode_transport_univ"
fetch(API_URL)
     .then(res => res.json())   //recupère données format json qui sera ensuite appélé data_json         
     .then(data_json => {

          //lier les boutons créer dans le fichier html au fichier javascript
        const person_univ_nombre = document.getElementById('person_univ_nombre');
        person_univ_nombre.addEventListener('click', change_person_univ_nombre);
  
        const person_univ_pourcent = document.getElementById('person_univ_pourcent');
        person_univ_pourcent.addEventListener('click', change_person_univ_pourcent);
  
        const mode_transport_univ_nombre = document.getElementById('mode_transport_univ_nombre');
        mode_transport_univ_nombre.addEventListener('click', change_mode_transport_univ_nombre);
     
        const mode_transport_univ_pourcent  = document.getElementById('mode_transport_univ_pourcent');
        mode_transport_univ_pourcent.addEventListener('click', change_mode_transport_univ_pourcent );
  
        const mode_transport_univ_nombre2  = document.getElementById('mode_transport_univ_nombre2');
        mode_transport_univ_nombre2.addEventListener('click', change_mode_transport_univ_nombre2 ); 

        this.color()
        
        const liste_data3 = []
        const liste_data2 = Array(this.mode_transport(data_json).length).map(e => Array(this.mode_transport(data_json).length).fill("none")) //liste vide
        //peut avoir des université dont tout les mode de transport ne sont utilisé, cette fonction de traités les données
        // de ces données et remplacer la valeur des modes de transport qui ne sont pas utilisés par 0
        for(let i=0; i<mode_transport(data_json).length; i++){   //cas université qui n'ont pas tous les labels
            if (this.liste_valeurs(data_json)[i].length < this.plus_grande_valeur(this.longueur_element_liste(data_json))){  
                let j= 0;
                let k = 0;
                do {
                  if(this.mode_transport(data_json)[i][k] == this.mode_transport_complet(data_json)[j]){
                    liste_data2[j] = this.liste_valeurs(data_json)[i][k];
                    k += 1;
                    j += 1;
                  }
                  else{
                    liste_data2[j] = 0;
                    j += 1;
                  }
                } while ((j <this.mode_transport_complet(data_json).length) && (k < this.mode_transport(data_json)[i].length ));
                liste_data3.push(liste_data2);
            }
            else {
               liste_data3.push(this.liste_valeurs(data_json)[i]);
            } 
        }
  
        var datasets = [];  // def datasets contruire data
        for (let i = 0; i < this.plus_grande_valeur(this.longueur_element_liste(data_json)); i++) {
          const data = { label : this.mode_transport_complet(data_json)[i], data: this.rangement_donnee(liste_data3, data_json)[i] };
          datasets.push(data);
        }

        const data1 = {   // def data pour construire config
          labels: this.liste_universite(data_json),
          datasets
        } 
        
        const config = this.config(data1)
        const myChart = new Chart(  // creation du graphe
          document.getElementById('myChart'), 
          config
        );

        
        // données creation du graphe a barre cumulé avec pourcentage mode transport par univ  
        var datasets = []; 
        for (let i = 0; i < this.mode_transport_complet(data_json).length ; i++) {
          const data = { label : this.mode_transport_complet(data_json)[i], data: pourcentage_mode_transport_univ_complet(liste_data3, data_json)[i]};
          datasets.push(data); 
        }
      
        const data2 = {   
          labels: this.labels(data_json),
          datasets
        } 

        // données creation du graphe mode transport par univ (représentation2)
        datasets=[]
        for (let i = 0; i < this.liste_universite(data_json).length ; i++) {
          const data = { label : this.liste_universite(data_json)[i], data: liste_data3[i]};
          datasets.push(data);
        }
        
        const data5 = {   
          labels: this.mode_transport_complet(data_json),
          datasets
        } 

         // données création du graphique répartition personnes par université: utilisation liste_sum, liste_univ calculé plus haut
         const data4 = {   
          labels: this.liste_universite(data_json),
          datasets: [{
            data: this.pourcentage_personne(liste_data3, data_json),
          }]
        }
        
         //vu en nombre
        const data3 = {   
          labels: this.liste_universite(data_json),
          datasets: [{
            label : "Nb_utilisateur_univ",
            data: this.nb_personne_univ(liste_data3, data_json),
          }]
        }
        
        
        // Création des fonctions pour passer d'un graphe a un autre grace a une mise a jour
        function change_person_univ_nombre(){
            const updatetype ="bar";
            myChart.config.type = updatetype;
            myChart.config.data = data3;
            myChart.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université";
            myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return "Nb_utilisateur" + ':'+ ' ' + context.raw  } ;
            myChart.config.options.plugins.autocolors.mode = "data";
            myChart.config.options.plugins.autocolors.offset = 0;
            myChart.config.options.scales.x.display = true;
            myChart.config.options.scales.y.display = true;
            myChart.config.options.scales.x.stacked = false;
            myChart.config.options.scales.y.stacked = false;
            myChart.config.options.scales.y.ticks.callback = (value) => {return value };
            myChart.update();
        }
  
        function change_person_univ_pourcent(){
            const updatetype ="pie";
            myChart.config.type = updatetype;
            myChart.config.data = data4;
            myChart.config.options.plugins.title.text = "Répartition des personnes par université";
            myChart.config.options.plugins.autocolors.mode = "data"; //an array of colors, equivalent to the length of data is provided for each dataset(par defaut)
            myChart.config.options.plugins.autocolors.offset = 1 // //used to offset the color generation by a number of colors
            myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.label + ':'+ ' ' + context.raw   + '%'} ;
            myChart.config.options.scales.x.display = false;
            myChart.config.options.scales.y.display = false;
            myChart.update();
        }
        
        function change_mode_transport_univ_nombre(){
            const updatetype ="bar";
            myChart.config.type = updatetype
            myChart.config.data = data1;
            myChart.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université";
            myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':'+ ' ' + context.raw  } ;
            myChart.config.options.plugins.autocolors.mode = "data";
            myChart.config.options.plugins.autocolors.offset = 1;
            myChart.config.options.scales.x.display = true;
            myChart.config.options.scales.y.display = true;
            myChart.config.options.scales.x.stacked = false;
            myChart.config.options.scales.y.stacked = false;
            myChart.config.options.scales.y.ticks.callback = (value) => {return value };
            myChart.update();
          }
  
        function change_mode_transport_univ_pourcent(){
            const updatetype ="bar";
            myChart.config.type = updatetype;
            myChart.config.data = data2;
            myChart.config.options.plugins.title.text = "Pourcentage mode de transport par université";
            myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' } ;  
            myChart.config.options.plugins.autocolors.mode = "dataset";  // a new color is picked for each dataset 
            myChart.config.options.plugins.autocolors.offset = 1;
            myChart.config.options.scales.x.display = true;
            myChart.config.options.scales.y.display = true;
            myChart.config.options.scales.x.stacked = true;
            myChart.config.options.scales.y.stacked = true;
            myChart.config.options.scales.y.beginAtZero = true;
            myChart.config.options.scales.y.ticks.callback = (value) => {return value + '%'}; //ajout pourcentage axe absicesse
            myChart.config.options.responsive = true ;
            myChart.update();
          } 
  
        function change_mode_transport_univ_nombre2(){
            const updatetype ="bar";
            myChart.config.type = updatetype;
            myChart.config.data = data5;
            myChart.config.options.plugins.title.text = "Nombre d utilisateur mode de transport par université";
            myChart.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y };   
            myChart.config.options.plugins.autocolors.mode = "dataset";  // a new color is picked for each dataset 
            myChart.config.options.plugins.autocolors.offset = 1 ; 
            myChart.config.options.scales.x.display = true;
            myChart.config.options.scales.y.display = true;
            myChart.config.options.scales.x.stacked = true;
            myChart.config.options.scales.y.stacked = true;
            myChart.config.options.scales.y.beginAtZero = true;
            myChart.config.options.scales.y.ticks.callback = (value) => {return value } //ajout pourcentage axe absicesse;
            myChart.config.options.responsive = true ;
            myChart.update();
          }   
          
          
   /********  graphe Distance *******/
 
const API_URL2 = "http://127.0.0.1:8000/distance_mode_transport_univ_trajet_km"
fetch(API_URL2) 
      .then(res => res.json())         //recupère données format json qui sera ensuite appélé JSONdata         
      .then( data_json => {
   
        //lier les boutons créer dans le fichier html au fichier javascript
        const Distance_mode_transport_univ= document.getElementById('Distance_mode_transport_univ');
        Distance_mode_transport_univ.addEventListener('click', change_Distance_mode_transport_univ);

        const Distance_mode_transport_univ_pourcent  = document.getElementById('Distance_mode_transport_univ_pourcent');
        Distance_mode_transport_univ_pourcent.addEventListener('click', change_Distance_mode_transport_univ_pourcent );
   
        const Distance_mode_transport_univ_pourcent2  = document.getElementById('Distance_mode_transport_univ_pourcent2');
        Distance_mode_transport_univ_pourcent2.addEventListener('click', change_Distance_mode_transport_univ_pourcent2 );
   
        this.color();

        const liste_data3 = []
        const liste_data2 = Array(this.mode_transport(data_json).length).map(e => Array(this.mode_transport(data_json).length).fill("none")) //liste vide
        //peut avoir des université dont tout les mode de transport ne sont utilisé, cette fonction de traités les données
        // de ces données et remplacer la valeur des modes de transport qui ne sont pas utilisés par 0
        for(let i=0; i<mode_transport(data_json).length; i++){   //cas université qui n'ont pas tous les labels
            if (this.liste_valeurs(data_json)[i].length < this.plus_grande_valeur(this.longueur_element_liste(data_json))){  
                let j= 0;
                let k = 0;
                do {
                  if(this.mode_transport(data_json)[i][k] == this.mode_transport_complet(data_json)[j]){
                    liste_data2[j] = this.liste_valeurs(data_json)[i][k];
                    k += 1;
                    j += 1;
                  }
                  else{
                    liste_data2[j] = 0;
                    j += 1;
                  }
                } while ((j <this.mode_transport_complet(data_json).length) && (k < this.mode_transport(data_json)[i].length ));
                liste_data3.push(liste_data2);
            }
            else {
               liste_data3.push(this.liste_valeurs(data_json)[i]);
            } 
        }
   
         // données creation graphique mode transport pour chaque univ(vu en nombre)
        var datasets = [];  // def datasets contruire data
        for (let i = 0; i < this.plus_grande_valeur(this.longueur_element_liste(data_json)) ; i++) {
           const data = { label : this.mode_transport_complet(data_json)[i], data: this.rangement_donnee(liste_data3, data_json)[i] }
           datasets.push(data);
        }
       
        const data1 = {   // def data pour construire config
          labels: this.liste_universite(data_json),
          datasets
        } 
        
        const config = this.config(data1);
       
       // config.options.plugin.title.text = Pourcentage distance totale (en km) mode de transport par université sur un trajet;

        const myChart2 = new Chart(  // creation du graphe
          document.getElementById('myChart2'), 
          config
        );

        myChart2.config.options.plugins.title.text = " Distance totale (en km) mode de transport par université sur un trajet ";
        myChart2.update();

         // données creation du graphe a barre pourcentage Distance mode transport par univ(representation 1)
        var datasets = []; 
        for (let i = 0; i < this.mode_transport_complet(data_json).length ; i++) {
          const data = { label : this.mode_transport_complet(data_json)[i], data : rangement_donnee2( liste_data3, data_json)[i] };
          datasets.push(data); 
        }
      
        const data2 = {   
          labels: this.liste_universite(data_json),
          datasets
        } 
        
        // données creation du graphe a barre cumulé pourcentage Distance mode transport par univ(représentation2)
        var datasets = [];  // def datasets contruire data
        for (let i = 0; i < this.mode_transport_complet(data_json).length ; i++) {
            const data = { label : this.mode_transport_complet(data_json)[i], data : pourcentage_mode_transport_univ_complet(liste_data3, data_json)[i] };
            datasets.push(data);
        }
        
        const data3 = {   // def data pour construire config
            labels: this.labels(data_json),
            datasets
        }  
     
 
         // Création des fonctions pour passer d'un graphe a un autre grace a une mise a jour
         function change_Distance_mode_transport_univ(){
             const updatetype ="bar";
             myChart2.config.type = updatetype;
             myChart2.config.data = data1;
             myChart2.config.options.plugins.title.text = " Distance totale (en km) mode de transport par université sur un trajet ";
             myChart2.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':'+ ' ' + context.raw;  } 
             myChart2.config.options.plugins.autocolors.mode = "data";
             myChart2.config.options.plugins.autocolors.offset = 0;
             myChart2.config.options.scales.x.display = true;
             myChart2.config.options.scales.y.display = true;
             myChart2.config.options.scales.x.stacked = false;
             myChart2.config.options.scales.y.stacked = false;
             myChart2.config.options.scales.y.ticks.callback = (value) => {return value };
             myChart2.config.options.responsive = true;
             myChart2.update();
           }
   
           function change_Distance_mode_transport_univ_pourcent(){
             const updatetype ="bar";
             myChart2.config.type = updatetype;
             myChart2.config.data = data2;
             myChart2.config.options.plugins.title.text = "Pourcentage distance totale (en km) mode de transport par université sur un trajet";
             myChart2.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' } ;  
             myChart2.config.options.plugins.autocolors.mode = "dataset";  // a new color is picked for each dataset 
             myChart2.config.options.plugins.autocolors.offset = 1;
             myChart2.config.options.scales.x.display = true;
             myChart2.config.options.scales.y.display = true;
             myChart2.config.options.scales.x.stacked = false;
             myChart2.config.options.scales.y.stacked = false;
             myChart2.config.options.scales.y.beginAtZero = true;
             myChart2.config.options.scales.y.ticks.callback = (value) => {return value + '%'}; //ajout pourcentage axe absicesse
             myChart2.config.options.responsive = true ;
             myChart2.update();
           }    
 
           function change_Distance_mode_transport_univ_pourcent2(){
             const updatetype ="bar";
             myChart2.config.type = updatetype;
             myChart2.config.data = data3;
             myChart2.config.options.plugins.title.text = "Pourcentage distance totale (en km) mode de transport par université ";
             myChart2.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' }  ; 
             myChart2.config.options.plugins.autocolors.mode = "dataset";  // a new color is picked for each dataset 
             myChart2.config.options.plugins.autocolors.offset = 1;
             myChart2.config.options.scales.x.display = true;
             myChart2.config.options.scales.y.display = true;
             myChart2.config.options.scales.x.stacked = true;
             myChart2.config.options.scales.y.stacked = true;
             myChart2.config.options.scales.y.beginAtZero = true;
             myChart2.config.options.scales.y.ticks.callback = (value) => {return value + '%'}; //ajout pourcentage axe absicesse
             myChart2.config.options.responsive = true ;
             myChart2.update();
           }    
     })


     /********  graphe Co2 *******/
    
  const API_URL3 = "http://127.0.0.1:8000/emission_co2_mode_transport_univ_annee_kgCo2"
  fetch(API_URL3) 
     .then(res => res.json())         //recupère données format json qui sera ensuite appélé JSONdata         
     .then( data_json => {
  
        //lier les boutons créer dans le fichier html au fichier javascript
  
        const Co2_mode_transport_univ= document.getElementById('Co2_mode_transport_univ');
        Co2_mode_transport_univ.addEventListener('click', change_Co2_mode_transport_univ);

        const Co2_mode_transport_univ_pourcent2  = document.getElementById('Co2_mode_transport_univ_pourcent2');
        Co2_mode_transport_univ_pourcent2.addEventListener('click', change_Co2_mode_transport_univ_pourcent2 );
        
        const Co2_mode_transport_univ_pourcent  = document.getElementById('Co2_mode_transport_univ_pourcent');
        Co2_mode_transport_univ_pourcent.addEventListener('click', change_Co2_mode_transport_univ_pourcent );

        this.color();
        
        const liste_data3 = []
        const liste_data2 = Array(this.mode_transport(data_json).length).map(e => Array(this.mode_transport(data_json).length).fill("none")) //liste vide
        //peut avoir des université dont tout les mode de transport ne sont utilisé, cette fonction de traités les données
        // de ces données et remplacer la valeur des modes de transport qui ne sont pas utilisés par 0
        for(let i=0; i<mode_transport(data_json).length; i++){   //cas université qui n'ont pas tous les labels
            if (this.liste_valeurs(data_json)[i].length < this.plus_grande_valeur(this.longueur_element_liste(data_json))){  
                let j= 0;
                let k = 0;
                do {
                  if(this.mode_transport(data_json)[i][k] == this.mode_transport_complet(data_json)[j]){
                    liste_data2[j] = this.liste_valeurs(data_json)[i][k];
                    k += 1;
                    j += 1;
                  }
                  else{
                    liste_data2[j] = 0;
                    j += 1;
                  }
                } while ((j <this.mode_transport_complet(data_json).length) && (k < this.mode_transport(data_json)[i].length ));
                liste_data3.push(liste_data2);
            }
            else {
               liste_data3.push(this.liste_valeurs(data_json)[i]);
            } 
        }
   
         // données creation graphique mode transport pour chaque univ(vu en nombre)
        var datasets = [];  // def datasets contruire data
        for (let i = 0; i < this.plus_grande_valeur(this.longueur_element_liste(data_json)) ; i++) {
           const data = { label : this.mode_transport_complet(data_json)[i], data: this.rangement_donnee(liste_data3, data_json)[i] }
           datasets.push(data);
        }
       
        const data1 = {   // def data pour construire config
          labels: this.liste_universite(data_json),
          datasets
        } 
        
        const config = this.config(data1);
        //config.options.plugin.title.padding.top = 130;
        //config.options.plugin.title.padding.bottom = 20;

        const myChart3 = new Chart(  // creation du graphe
          document.getElementById('myChart3'), 
          config
        );

        myChart3.config.options.plugins.title.text = " Emission Co2 (en KgCo2) sur une année mode de transport par université ";
        myChart3.update();
        
       // données creation du graphe a barre pourcentage emission CO2 mode transport par univ(representation 1)
        var datasets = []; 
        for (let i = 0; i < this.mode_transport_complet(data_json).length ; i++) {
           const data = { label : this.mode_transport_complet(data_json)[i], data : rangement_donnee2( liste_data3, data_json)[i] };
           datasets.push(data); 
        }
       
        const data2 = {   
           labels: this.liste_universite(data_json),
           datasets
        } 
         
         // données creation du graphe a barre cumulé pourcentage emission CO2  mode transport par univ(représentation2)
         var datasets = [];  // def datasets contruire data
         for (let i = 0; i < this.mode_transport_complet(data_json).length ; i++) {
             const data = { label : this.mode_transport_complet(data_json)[i], data : pourcentage_mode_transport_univ_complet(liste_data3, data_json)[i] };
             datasets.push(data);
         }
         
         const data3 = {   // def data pour construire config
             labels: this.labels(data_json),
             datasets
         }  
      
        // Création des fonctions pour passer d'un graphe a un autre grace a une mise a jour       
        function change_Co2_mode_transport_univ(){
            const updatetype ="bar";
            myChart3.config.type = updatetype;
            myChart3.config.data = data1;
            myChart3.config.options.plugins.title.text = "Emission Co2 (en KgCo2) sur une année mode de transport par université"
            myChart3.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':'+ ' ' + context.raw  } ;
            myChart3.config.options.plugins.autocolors.mode = "data";
            myChart3.config.options.plugins.autocolors.offset = 1;
            myChart3.config.options.scales.x.display = true;
            myChart3.config.options.scales.y.display = true;
            myChart3.config.options.scales.x.stacked = false;
            myChart3.config.options.scales.y.stacked = false;
            myChart3.config.options.scales.y.ticks.callback = (value) => {return value };
            myChart3.config.options.scales.y.ticks.stepSize = 9000;
            myChart3.config.options.responsive = true;
            myChart3.update();
          }
  
          function change_Co2_mode_transport_univ_pourcent(){
            const updatetype ="bar";
            myChart3.config.type = updatetype;
            myChart3.config.data = data2;
            myChart3.config.options.plugins.title.text = "Pourcentage Emission co2 (en kgCo2) sur une année mode de transport par université ";
            myChart3.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' } ;  
            myChart3.config.options.plugins.autocolors.mode = "dataset" ; // a new color is picked for each dataset 
            myChart3.config.options.plugins.autocolors.offset = 1;
            myChart3.config.options.scales.x.display = true;
            myChart3.config.options.scales.y.display = true;
            myChart3.config.options.scales.x.stacked = false;
            myChart3.config.options.scales.y.stacked = false;
            myChart3.config.options.scales.y.beginAtZero = true;
            myChart3.config.options.scales.y.ticks.callback = (value) => {return value + '%'} //ajout pourcentage axe absicesse;
            myChart3.config.options.scales.y.ticks.stepSize = 10;
            myChart3.config.options.responsive = true ;
            myChart3.update();
          }    

          function change_Co2_mode_transport_univ_pourcent2(){
            const updatetype ="bar";
            myChart3.config.type = updatetype;
            myChart3.config.data = data3;
            myChart3.config.options.plugins.title.text = "Pourcentage Emission co2 (en kgCo2) sur une année mode de transport par université "
            myChart3.config.options.plugins.tooltip.callbacks.label =  (context) => { return context.dataset.label + ':' + ' ' + context.parsed.y  + '%' };   
            myChart3.config.options.plugins.autocolors.mode = "dataset"  // a new color is picked for each dataset 
            myChart3.config.options.plugins.autocolors.offset = 1;
            myChart3.config.options.scales.x.display = true;
            myChart3.config.options.scales.y.display = true;
            myChart3.config.options.scales.x.stacked = true;
            myChart3.config.options.scales.y.stacked = true;
            myChart3.config.options.scales.y.beginAtZero = true;
            myChart3.config.options.scales.y.ticks.callback = (value) => {return value + '%'}; //ajout pourcentage axe absicesse
            myChart3.config.options.scales.y.ticks.stepSize = 10;
            myChart3.config.options.responsive = true; 
            myChart3.update();
          }
    })
       
})
