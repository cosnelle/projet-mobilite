//tableau calcul GES 
// tableau.js
// tableau des GES en fonction des modes de transport et des distances

// @elements
//        DISTANCES
//        utilisation d'une discretisation des distances
//        [0;3], [3;5], [5;10], [10;20], [20;50], [50;100], [100;250]
//        
//        RECUPERATION DES DONNEES
//        appel des donn�es se fait avec une API REST fastAPI en python
//        API lanc�e en locale
//        
//        CALCUL DES GES
//        pour les calculs nous utiliserons des fonction python directement impl�ment�es dans
//        l API locale

const url_co2 = "http://127.0.0.1:8000/data_mobilite/tableau/calculCO2";

function hideloader(){
  document.getElementById('loading').style.display = 'none';
}


//fonction affichage
// ici la fonction affichageData est specifique au service cr��
function affichageDataCO2(data){
  // premi�re ligne du tabeau correspond aux distances discr�tis�es
  // QUESTION : possibilit� d'automatiser cette phase ? Utilit� d'automatiser ?
  //          Si les tranches de distance changent : OUI Sinon ?
  let tab =
      `<tr>
        <th>  </th>
        <th> 0 � 3 km </th>
        <th> 3 � 5 km</th>
        <th> 5 � 10 km</th>
        <th> 10 � 20 km</th>
        <th> 20 � 50 km</th>
        <th> 50 � 100 km</th>
        <th> 100 � 250 km</th>
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
  document.getElementById("ges").innerHTML = tab;
  
}
  
//getData
async function getDataCO2(url){
  // recuperation de la reponse
  const reponse = await fetch(url);
  
  // stockage des donnees
  var data = await reponse.json();
  console.log(data);
  if(reponse){
    hideloader();
  }
  affichageDataCO2(data);
}
// appel de la fonction getData
getDataCO2(url_co2);