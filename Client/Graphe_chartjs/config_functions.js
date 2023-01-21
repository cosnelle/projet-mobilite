
         /* Projet Ingenieur PolytechLille  
            Annees universitaire 2022-2023
            Contributeurs : Cosnelle DJOUMEKOUM & Julie RIDOLFI */
  
//index.js

//fonction commun pour les différents graphes
function color(){
  const autocolors = window['chartjs-plugin-autocolors']; // génération de couleurs automatique pour les différents graphiques
  Chart.register(autocolors);  //Enregistrement de tous les graphe
}

function liste_universite(data_json){
  const liste_univ  = data_json.data.map(
    function(index){  //considère tous ensemble data st des index, pour chaque index recurepère clé
      return Object.keys(index)[0]; // Object.keys(index) retourne les differents label sous forme de liste,  [0] permet de récupérer la valeur
    })
  return liste_univ;
}

//Recupération données pour chaque université (valeurs et clés)
function donnee(data_json){
  const donnee  = data_json.data.map( index => {
      return Object.values(index)[0];  //parcours une liste d'ensemble(dictionnaire) et recupère les valeurs
    })
  return donnee;
}

//Recupération des clés
function mode_transport(data_json){
  const mode_transport = [];
  for(let i=0; i<donnee(data_json).length; i++){
     mode_transport.push(Object.keys(donnee(data_json)[i]))
  }
  return mode_transport;
}

 //Recupération des valeurs
function liste_valeurs(data_json){
  const liste_data = donnee(data_json).map( index => {
   return Object.values(index);
  });
  return liste_data;
}

//avoir la longueur les élements d'une liste de liste
//étant donnée qu'il peut avoir des université ou certains modes de transport ne sont pas utilisé,
//l'idée ici est d'avoir une liste avec tous les modes transport(on prend l'université qui a le plus
//grand nombre de mode de transport renseigné)
//Ainsi, ce code marche uniquement si dans notre jeu de données il y'a au moins une université qui contient
//tous les modes de transport renseignés dans d'autres université
function longueur_element_liste(data_json){
  const tab = []
    for(let i=0; i<mode_transport(data_json).length; i++){
      tab.push(mode_transport(data_json)[i].length)
    }
  return tab;
}  

function plus_grande_valeur(NomTableau){    //fonction renvoie valeur max d'un tableau
      var ValeurMax = NomTableau[0];
      for (let i=0; i<NomTableau.length; i++) {
          if (NomTableau[i] > ValeurMax){
              return ValeurMax = NomTableau[i];
          }
      }
  }  

function mode_transport_complet(data_json){
    var mode_transport_complet = []
    for (let i = 0; i < mode_transport(data_json).length ; i++){
        if ((mode_transport(data_json)[i].length) == plus_grande_valeur(longueur_element_liste(data_json))){
          mode_transport_complet = mode_transport(data_json)[i]
         }
      }
    return mode_transport_complet;
}


//fonction qui prend une liste de liste
//et le réorganise en une liste de liste contenant plus d'élements pour pouvoir 
//construire le graphe souhaité
function rangement_donnee(liste_liste, data_json){
  var value_list =  []   
  var liste_value_list = []
  for (let j=0; j<plus_grande_valeur(longueur_element_liste(data_json)); j++){   
      for(let i=0; i<liste_liste.length; i++) {
          let value = (liste_liste[i])[j]
          value = value.toFixed(2);
          value_list.push(value)
      } 
      liste_value_list.push(value_list) 
      value_list = []
  }
  return liste_value_list
}

function config(data){
  const lighten = (color, value) => Chart.helpers.color(color).lighten(value).rgbString();
  const config = { // def config pour créer le graphe
    type: 'bar',
    data: data,
    options : {
      plugins: {        
        title: {
          display: true,
          text: 'Nombre d utilisateur mode de transport par université',
          font: {
            size: 16,
          },
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
  return config;
}


// données creation du graphe a barre cumulé avec pourcentage mode transport par univ
function labels(data_json){
  const labels2  = [];
  for(let i=0; i<liste_universite(data_json).length; i++){
   labels2.push(liste_universite(data_json)[i]);
  }
  labels2.push("Nb_utilisateur_global");
  return labels2;
}

function nb_personne_univ(liste_liste, data_json){
  var liste_sum = [];     //somme nb_utilisateur mode transport par univ(nb_personne par université)
  sum = 0;
  for(let i=0; i<liste_liste.length; i++){
    for (let j=0; j<plus_grande_valeur(longueur_element_liste(data_json)); j++){
       sum += (liste_liste[i])[j]
    }
    liste_sum.push(sum);
    sum = 0;
   }
  return liste_sum;
}

function pourcentage_mode_transport_univ(liste_liste,data_json){
var val =  [] ;  //calcul pourcentage nb_utilisateur mode transport par univ
var liste_val = [];
for (let j=0; j<plus_grande_valeur(longueur_element_liste(data_json)); j++){
    for(let i=0; i<liste_liste.length; i++) {
        let value = ((liste_liste[i])[j]/ nb_personne_univ(liste_liste, data_json)[i])*100;
        value = value.toFixed(1);
        val.push(value);
    } 
    liste_val.push(val);  //creation d'une liste de liste chaque liste contenant pourcentage d'un mode de transport pour les différents univ
    val = [];
}
return liste_val;
}


//pourcentage global (tous les univ)
//nb_utilisateur total
function nb_person_total(liste_liste, data_json){
util_total  = 0 ;  
for(let i=0; i<nb_personne_univ(liste_liste,data_json).length; i++){
  util_total += nb_personne_univ(liste_liste, data_json)[i];
}
return util_total;
}

//nb_utilisateur total par mode de transport
function nb_utilisateur_mode_transport_total(liste_liste,data_json){
var data_global = [] ; 
total = 0; 
for (let j=0; j<plus_grande_valeur(longueur_element_liste(data_json)); j++){
    for(let i=0; i<liste_liste.length; i++) {
        total +=  (liste_liste[i])[j]
    } 
    data_global.push(total) ;
    total = 0 ;
}
return data_global;
}

function  pourcentage_mode_transport_total(liste_liste, data_json) {
var liste_pourcent_mode_transport = [];      //calcul pourcentage nb_utilisateur mode transport global
for(let i=0; i<nb_utilisateur_mode_transport_total(liste_liste, data_json).length; i++){
    let pourcent_mode_transport = (nb_utilisateur_mode_transport_total(liste_liste, data_json)[i]/nb_person_total(liste_liste, data_json))*100;
    pourcent_mode_transport = pourcent_mode_transport.toFixed(1);
    liste_pourcent_mode_transport.push(pourcent_mode_transport);
}
return liste_pourcent_mode_transport;
}

function pourcentage_mode_transport_univ_complet( liste_liste, data_json){
  const liste_val_complet = pourcentage_mode_transport_univ(liste_liste, data_json);
  for (let i=0; i<pourcentage_mode_transport_total(liste_liste, data_json).length; i++){  //rajout de la valeur pourcent global dans listes contenues dans liste_val
     liste_val_complet[i].push(pourcentage_mode_transport_total(liste_liste, data_json)[i])  
  }
return liste_val_complet;
}

// données création du graphique répartition personnes par université: utilisation liste_sum, liste_univ calculé plus haut
      //calcul pourcentage
function pourcentage_personne(liste_liste, data_json){
  var liste_pourcent = [] ;   
  for(let i=0; i<nb_personne_univ(liste_liste, data_json).length; i++){
        let calcul_pourcent = (nb_personne_univ(liste_liste, data_json)[i]/nb_person_total(liste_liste, data_json))*100;
        calcul_pourcent = calcul_pourcent.toFixed(1);
        liste_pourcent.push(calcul_pourcent);
          }
  return liste_pourcent;
}

//fonctions graphe Distance et emission CO2, construction graphe pourcentage en barre car 
//pour le graphe a barre cumulé des valeurs pour certains mode de transport son très petite
function rangement_donnee2(liste_liste, data_json){
  var value_list =  []   
  var liste_value_list = []
  for (let j=0; j<plus_grande_valeur(longueur_element_liste(data_json)); j++){   
      for(let i=0; i<liste_liste.length; i++) {
        let value = (liste_liste[i][j]/nb_personne_univ(liste_liste, data_json)[i])*100
        value = value.toFixed(2);
        value_list.push(value)  
      } 
      liste_value_list.push(value_list) 
      value_list = []
  }
  return liste_value_list
}
       

