// carte.js
// ensemble du code pour la creation de la carte openstreetmap
// utilisation du framework Leaflet

// fonction js utilisees dans ce programme
function hideloader(){
  document.getElementById('loading').style.display = 'none';
}

// url de recuparation des coordonnees des villes domiciles et de travail
//   contient egalement le nombre de personnes par trajet
url = 'http://127.0.0.1:8000/data_mobilite/geo/trajet/nbPers'

// fonction qui recupere les donnees
async function get_data(url){
  // recuperation de la reponse
  const reponse = await fetch(url);
  // stockage des donnees
  var data = await reponse.json();
  if(reponse){
    hideloader();
  }
  // appel de la fonction qui affiche sur la carte les lieux
  affichage_lieux(data);
}

// fonction de affichage des lieux
// affichage different : domicile (cercle) et travail (marqueur)
function affichage_lieux(data){
   for (let r of data.data){
    new_circle(r.domicile);
    new_marker(r.travail);
  }
  
}

// fonction de creation du cercle de la commune
//    qui prend en parametre les donnees au format json
function new_circle(data){
  // coordonnees GPS + nom de la commune
  let lat = data.coordonnees_centre[0];
  let long = data.coordonnees_centre[1];
  let nom_ville = data.nom;
  
  var new_ville = L.circle([lat, long], {
    color: 'red',
    fillOpacity: 0.2,
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
  let lat = data.coordonnees_centre[0];
  let long = data.coordonnees_centre[1];
  let nom_ville = data.nom;
  //creation du lieu
  var univ = L.marker([lat, long]).bindPopup(nom_ville);
  // ajout du lieu
  univ.addTo(macarte);
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


// appel fonctions
get_data(url);
