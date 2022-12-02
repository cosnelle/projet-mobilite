
## Description du contenu du repertoire

Nous retrouvons dans le r�pertoire Cartographie, l'ensemble des graphique n�cessaire � la mod�lisation des flux de d�placement des individus ayant r�pondu � l'enqu�te mobilit�. Ce r�pertoire est compos� de programmes html et js. Les programme html, nous permet de visualiser le code Javascript. Les programmes js permettent de cr�er les graphiques et autre �l�ments n�cessaires � l'analyse de la mobilit� des individus.  
Les fichiers disponibles sont les suivants :  

- carte.js  
Ce code JavaScript permet la cr�ation d'une carte visualisant les lieux de domicile, de travail et les flux de d�placement entre ces deux lieux. Pour cela, nous avons utilis� la librarie [Leaflet](https://leafletjs.com/) et le support de carte de [OpenStreetMap](https://www.openstreetmap.fr/).  
Sur la carte, nous retrouvons des marqueurs bleu qui repr�sente les lieux de travail (autrement dit les universit�s), les cercles rouges correspondent au lieux suppos�s de domicile et les traits verts repr�sentent les flux de d�placement entre ces deux lieux. Le trait est donc plus ou moins �pais en fonction du nombre de personnes empruntant ce trajet.  

- tableau.js  
Ce code JavaScript permet de cr�er un tableau pr�sentant les d�placement des individus. Sur la premi�re colonne nous retrouvons le code Postal du lieu de domicile, sur la deuxi�me colonne nous retrouvons le lieu de travail et la derni�re colonne nous donne le nombre de personnes qui font ce trajet.  

- sankey.js  
Ce code JavaScript permet de cr�er un diagramme de Sankey (diagramme repr�sentant des flux entre une source et une cible : [Wikipedia](https://fr.wikipedia.org/wiki/Diagramme_de_Sankey)). Nous avons utilis� la librarie [Plotly](https://plotly.com/javascript/) qui poss�de une impl�mentation du diagramme de Sankey. Pour cr�er ce diagramme nous utilisons donc la fonction suivante :  

`Plotly.newPlot('mon_graphique', data, layout)`

Et nous pr�cisons dans **data** le type de graphique utilis� :  

` var data = {`
`   type: "sankey",`
`    .... `
` }`

` var data = [data]`

## API utilis�e

