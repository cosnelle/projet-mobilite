// sankey.js
d3.json('http://127.0.0.1:8000/geo/flux/sankey', function(fig){

const source = fig.links.map(
  function(index){
    return index.source;
  })

const target = fig.links.map(
  function(index){
    return index.target;
  })

const value = fig.links.map(
  function(index){
    return index.value;
  })

// fonction qui genere un vecteur de couleurs a partir d un nombre de noeuds
function generateRandomColors(nbNodes) {
  let colors= [];
  
  for (var i = 0; i < nbNodes; i++) {
    // rgba
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    color="rgba(" + r + "," + g + "," + b + "," + 0.5 +")";
    colors.push(color);
  }
  return colors;
}

// appel de la fonction generateRandomColors()
let color_random = generateRandomColors(fig.nodes.length);

console.log(color_random);
console.log(source);

// creation vecteur de couleur des liens en fonction de la source
let links_color_source = [];

for (var i =0; i< source.length; i++){
  indice = source[i]
  color = color_random[indice];
  links_color_source.push(color);
}

// creation vecteur de couleur des liens en fonction de la cible
let links_color_target = [];

for (var i =0; i< target.length; i++){
  indice = source[i]
  color = color_random[indice];
  links_color_target.push(color);
}

// vecteur de couleur a gris
let links_color_no = "gray";

//initialisation de la couleur des liens
let links_color = links_color_source;

// configuration des donnees
var data = {
  type: "sankey",
  domain: {
    x: [0,1],
    y: [0,1]
  },
  orientation: "h",
  valuesuffix: "Personnes",
  node: {
    pad: 15,
    thickness: 15,
    line: {
      width: 0.5
    },
   label: fig.nodes,
   color: color_random
      },

  link: {
    source: source, 
    target: target,
    value: value,
    opacity: 0.1,
    color: links_color
  }
}

var data = [data]

// configuration du graphe
var layout = {
  title: "Les flux de déplacement du personnels et des étudiants de l'Université de Lille",
  width: 1118,
  height: 772,
  font: {
    size: 10,
    color: "black"
  }
}

Plotly.newPlot('my_dataviz', data, layout)


});

