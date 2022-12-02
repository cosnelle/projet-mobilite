
## Description du contenu du répertoire

Nous retrouvons dans le répertoire Cartographie, l'ensemble des graphiques nécessaires à la modélisation des flux de déplacement des individus ayant répondu à l'enquête mobilité. Ce répertoire est composé de programmes html et js. Les programmes html, nous permettent de visualiser le code Javascript. Les programmes js permettent de créer les graphiques et autres éléments nécessaires à l'analyse de la mobilité des individus.  
Les fichiers disponibles sont les suivants :  

- carte.js  
Ce code JavaScript permet la création d'une carte visualisant les lieux de domicile, de travail et les flux de déplacement entre ces deux lieux. Pour cela, nous avons utilisé la librarie [Leaflet](https://leafletjs.com/) et le support de carte de [OpenStreetMap](https://www.openstreetmap.fr/).  
Sur la carte, nous retrouvons des marqueurs bleus qui représentent les lieux de travail (autrement dit les universités), les cercles rouges correspondent au lieux supposés de domicile et les traits verts représentent les flux de déplacement entre ces deux lieux. Le trait est donc plus ou moins épais en fonction du nombre de personnes empruntant ce trajet.  

- tableau.js  
Ce code JavaScript permet de créer un tableau présentant les déplacements des individus. Sur la première colonne nous retrouvons le code Postal du lieu de domicile, sur la deuxième colonne nous retrouvons le lieu de travail et la dernière colonne nous donne le nombre de personnes qui font ce trajet.  

- sankey.js  
Ce code JavaScript permet de créer un diagramme de Sankey (diagramme représentant des flux entre une source et une cible : [Wikipedia](https://fr.wikipedia.org/wiki/Diagramme_de_Sankey)). Nous avons utilisé la librarie [Plotly](https://plotly.com/javascript/) qui possède une implémentation du diagramme de Sankey. Pour créer ce diagramme nous utilisons donc la fonction suivante :  
`Plotly.newPlot('mon_graphique', data, layout)`  
Et nous précisons dans **data** le type de graphique utilisé :  

` var data = {type: "sankey",.... }`   
` var data = [data]`


## API utilisée

Dans cette partie, nous verrons les routes utilisées dans l'API pour créer ces représentations graphiques. En effet, les données ne comportent pas de coordonnées géographiques nécessaires à la représentation de cartographie.  

A venir ...