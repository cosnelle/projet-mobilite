//fetch

const flux_url = "http://127.0.0.1:8000/data_mobilite/geo/flux/person";

function hideloader(){
  document.getElementById("loading").style.display = "none";
}


//fonction affichage
function affichageData(data){
  let tab =
      `<tr>
        <th>Domicile</th>
        <th>Travail</th>
        <th>Nbr_personnes</th>
      <tr>`;

  for (let r of data.data){
    tab += `<tr>
        <td>${r.domicile}</td>
        <td>${r.travail}</td>
        <td>${r.Nb_person}</td>
      <tr>`;
  }

  document.getElementById("flux_pers").innerHTML = tab;

}

//getData
async function getFlux(url){
  // recuperation de la reponse
  const reponse = await fetch(url);

  // stockage des donnees
  var data = await reponse.json();
  console.log(data);
  if(reponse){
    hideloader();
  }
  affichageData(data);

  return data

}
// appel de la fonction getData
var donnees_flux = getFlux(flux_url);
