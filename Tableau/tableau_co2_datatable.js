//tableau calcul GES
// utilisation de la library dataTables qui permet de dynamiser des tableau html

// CODE QUI NE FONCTIONNE PAS
//   utilisation JQuery
// url qui récupère les données du serveur local
//var xmlhttp = new XMLHttpRequest();
//var url_co2 = "http://127.0.0.1:8000/data_mobilite/tableau/calculCO2";
//xmlhttp.open("GET", url_co2, true);
//xmlhttp.send();
//xmlhttp.onereadystatechange = function(){
//  if(this.readyState == 4 && this.status == 200){
//    var data = JSON.parse(this.responseText);
//    console.log(data)

//    $('#example').DataTable({
//      "data":data.data,
//      "columns": [
//        {"data": "d_00_03"},
//        {"data": "d_03_05"},
//        {"data": "d_05_10"},
//        {"data": "d_10_20"},
//        {"data": "d_20_50"},
//        {"data": "d_50_100"},
//        {"data": "d__100_250"}
//      ]
//    })
//  }
//}

// autre manière sans JQuery


const url_co2 = "http://127.0.0.1:8000/data_mobilite/tableau_DataTables/calculCO2";


function hideloader(){
    document.getElementById("loading").style.display = "none";
}

// fonction qui recupère les données à partir d'une URL
async function getDataCO2(url){
  // recuperation de la reponse
  const reponse = await fetch(url);

  // stockage des donnees
  var data = await reponse.json();
  console.log(data);
  if(reponse){
    hideloader();
  }
  affichageDataTable(data);
}

// fonction qui utilise la library DataTables pour affiche les données
//  sous forme de tableau
function affichageDataTable(data){
  $("#myTable").DataTable({
    bLengthChange: false,
    data: data.data,
    columns: [
      {"data": "mode"},
      {"data": "d_00_01"},
      {"data": "d_01_03"},
      {"data": "d_03_05"},
      {"data": "d_05_10"},
      {"data": "d_10_20"},
      {"data": "d_20_50"},
      {"data": "d_50_100"},
      {"data": "d__100_250"}
    ],
    // insertion de couleur en fonction de la quantité de GES
    //  NE FONCTIONNE PAS
    "rowCallback": function(row, data, index){
      var distance = parseFloat(data[5]);
      // selon les accords de Paris de 2019, les déplacements doivent
      //représenter 0.3tCO2e
      if(distance > 3000.00){
        $(row).find("td:eq(5)").css("background-color", "red");
      }
    }
  });

}

//appel pour recuperer les données et créer le tableau
getDataCO2(url_co2);