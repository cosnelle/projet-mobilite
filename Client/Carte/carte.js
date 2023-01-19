// carte.js
// ensemble du code pour la creation de la carte openstreetmap
// utilisation du framework Leaflet

var hostname ="127.0.0.1";


// fonction js utilisees dans ce programme
function hideloader(){
  document.getElementById('loading').style.display = 'none';
}

// fonction qui recupere les codes postaux de tous les domiciles renseignes dans la salle
//    prend en parametre une url d api
async function get_lieux(url,type){
  // recuperation de la reponse
  const reponse = await fetch(url);
  // stockage des donnees
  var data = await reponse.json();

  if(reponse){
    hideloader();
  }
  // appel de la fonction qui affiche sur la carte les lieux
  affichage_lieux(data,type);
}

// fonction d affichage des domiciles
//  prend en parametre les codes postaux sous forme de donnees en format JSON
//  dans le fichier fourni : une ligne = un code postal
function affichage_lieux(data, type){
  // boucle d affichage des domiciles
  for (let r of data.data){
    // recuperation des coordonnees GPS du centre de la commune de domicile
    let url_coordonnees =`https://geo.api.gouv.fr/communes?codePostal=${r}&fields=centre`; 
    get_coordonnees(url_coordonnees, type);

  }
  
}

// fonction qui recupere les coordonnees GPS du centre d une commune
async function get_coordonnees(url, type){
    // recuperation de la reponse
    const reponse = await fetch(url);
    // stockage des donnees
    var data = await reponse.json();

    if(reponse){
      hideloader();
    }
    // creation d un domicile ou bien d une universite
    if(type == "domicile"){
      new_circle(data);
    } else if(type == "travail"){
      new_marker(data);
    } else if (type == "points"){
      
    }
}

// fonction de creation du cercle de la commune
//    qui prend en parametre les donnees au format json
function new_circle(data){
  // coordonnees GPS + nom de la commune
  let lat = data[0].centre.coordinates[1];
  let long = data[0].centre.coordinates[0];
  let nom_ville = data[0].nom;
  
  var new_ville = L.circle([lat, long], {
    color: 'red',
    fillOpacity: 0.5,
    fillColor: '#f03',
    radius: 2500
  }).bindPopup(nom_ville);
  // ajout du cercle a la carte
  new_ville.addTo(macarte);
}

// fonction de creation d un marqueur bleu
//   qui represente un lieu de travail = universite
function new_marker(data){
  // coordonnees GPS + nom de la commune 
  let lat = data[0].centre.coordinates[1];
  let long = data[0].centre.coordinates[0];
  let nom_ville = data[0].nom;
  //creation du lieu
  var univ = L.marker([lat, long]).bindPopup(nom_ville);
  // ajout du lieu
  univ.addTo(macarte);
}

// creation fonction
// pour chacune des lignes de l objet data -> trace une ligne
async function get_flux(url){
  // recuperation de la reponse
  const reponse = await fetch(url);
  // stockage des donnees
  var data = await reponse.json();

  if(reponse){
    hideloader();
  }
  
  init_tracer_ligne(data);
}

// fonction d initialisation 
function init_tracer_ligne(data){
  
  for (let r of data.data){

    if(r.domicile != r.travail){
      let url_coordonnees_domicile =`https://geo.api.gouv.fr/communes?codePostal=${r.domicile}&fields=centre`;
      let url_coordonnees_travail =`https://geo.api.gouv.fr/communes?codePostal=${r.travail}&fields=centre`;
    
      let poids = r.Nb_person; 
      get_coordonnees_ligne(url_coordonnees_domicile, url_coordonnees_travail, poids);
    }
    
  }
  //layerControl.addOverlay(trait_nb_person, "Trajets en fonction du nombre de personnes");
  
}

// fonction qui recupere deux coordonnees GPS
async function get_coordonnees_ligne(url1, url2, weight){
    // recuperation de la reponse1
    const reponse1 = await fetch(url1);
    // stockage des donnees
    var data1 = await reponse1.json();

    if(reponse1){
      hideloader();
    }
    
    // recuperation de la reponse2
    const reponse2 = await fetch(url2);
    // stockage des donnees
    var data2 = await reponse2.json();

    if(reponse2){
      hideloader();
    }
    
    tracer_ligne(data1, data2, weight);
    
}

// fonction qui trace un trait
function tracer_ligne(data1, data2, weight){

  var poids = weight;

  var polyline = L.polyline([
    [data1[0].centre.coordinates[1], data1[0].centre.coordinates[0]],
    [data2[0].centre.coordinates[1], data2[0].centre.coordinates[0]]
    ]);
    
  polyline.setStyle({
    color: 'green', weight: poids
  }).bindPopup("Trajet de " + data1[0].nom + " à " + data2[0].nom + "<br />Nombre de personnes : " + poids);
  polyline.addTo(macarte);
  
}



//initialisation
// a l ouverture de l index_carte.html le centre de la carte correspond
//    aux coordonnees GPS suivant. Ces coordonnees correspondent au centre de
//    Douai.
var lat = 50.366669;
var lon =  3.06667;
var macarte= null;
          
//initialisation de la carte
macarte = L.map('map').setView([lat, lon], 9);
osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'données <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
                    minZoom: 5,
                    maxZoom: 20
});
osm.addTo(macarte);
                
// creation couches
var baseMaps = {"OpenStreetMap": osm};
            
// Layers control
var layerControl = L.control.layers(baseMaps).addTo(macarte);
            
//ajout d une echelle cartographique
L.control.scale().addTo(macarte);

// ajout des lieux de travail : universite represente par des marqueurs bleus
// url de l api FAST API
const url_travail = "http://"+hostname+":8000/data_mobilite/label_colonne/INSEE_TRA";

// domicile des individus represente par des zones rouges
// url de l api FAST API
const url_domicile = "http://"+hostname+":8000/data_mobilite/label_colonne/INSEE_DOM";

// appel fonctions
// ajout des domiciles
get_lieux(url_domicile, "domicile");
// ajout des lieux de travail
get_lieux(url_travail, "travail");


// creation des traits
// lancement depuis le button sur le fichier index.html
