//COMMENT(dmarchal:2023-01-09): Copyright and authors missing.
//COMMENT(dmarchal:2023-01-09): Mix of French & English in code. 

// tableau.js
// tableau des effectifs en fonction des modes de transport et des distances

// @elements
//        DISTANCES
//        utilisation d'une discretisation des distances
//        [0;3], [3;5], [5;10], [10;20], [20;50], [50;100], [100;250]
//        
//        RECUPERATION DES DONNEES
//        appel des données se fait avec une API REST fastAPI en python
//        API lancée en locale
//        

//COMMENT(dmarchal:2023-01-09): Remove reference to local webserver.
const url = "http://127.0.0.1:8000/data_mobilite/tableau";

//COMMENT(dmarchal:2023-01-09): Duplicate something already in tableau_co2.js, must be factored in. 
function hideloader(){
  document.getElementById('loading').style.display = 'none';
}


//COMMENT(dmarchal:2023-01-09): The following function duplicates something already in tableau_co2.js, must be factored in. 
//fonction affichage
// ici la fonction affichageData est specifique au service créé
function affichageData(data){
  // première ligne du tabeau correspond aux distances discrétisées
  // QUESTION : possibilité d'automatiser cette phase ? Utilité d'automatiser ?
  //          Si les tranches de distance changent : OUI Sinon ?
  let tab =
      `<tr>
        <th>  </th>
        <th> 0 à 3 km </th>
        <th> 3 à 5 km</th>
        <th> 5 à 10 km</th>
        <th> 10 à 20 km</th>
        <th> 20 à 50 km</th>
        <th> 50 à 100 km</th>
        <th> 100 à 250 km</th>
      <tr>`;
  let i=0; // indice qui nous permet de dire sur quel mode de transport nous sommes
  for (let r of data.data){
      tab += `<tr>
        <td>${data.mode[i]}</td>
        <td>${r.d_00_03}</td>
        <td>${r.d_03_05}</td>
        <td>${r.d_05_10}</td>
        <td>${r.d_10_20}</td>
        <td>${r.d_20_50}</td>
        <td>${r.d_50_100}</td>
        <td>${r.d_100_250}</td>
      <tr>`;
      i= i+1;
    
  }
  document.getElementById("flux_pers").innerHTML = tab;
  
}
  
//getData
async function getData(url){
  // recuperation de la reponse
  const reponse = await fetch(url);
  
  // stockage des donnees
  var data = await reponse.json();
  console.log(data);
  if(reponse){
    hideloader();
  }
  affichageData(data);
}
// appel de la fonction getData
getData(url);