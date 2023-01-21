Ce repertoire est constitué de 2 fichiers:


**index.html** : Contenant le code html pour lancer des différents graphique sur un serveur local.      
**index.js** : qui contient le code pour créer les différents graphiques chartjs en javascript   
**config_functions.js** : qui contient le code commun pour la création des différents graphes

le fichier index.html fait appel au fichier index.js  

Le fichier index.js permet de créer les graphes ci dessus avec différentes répresentations (diagramme en bar , camenbert, diagramme en bar cummulé):  
    - graphe présentation des différents modes de transport en fonction des universités  
    - graphe présentation des distances en fonction des modes de transport et des universités  
    - graphe présentation emission de Co2 en fonction des modes de transport et des universités  
    
Afin  de créer ces graphes, on fait appel au données présentes sur le serveur d'API grâce à la fonction fetch  
Il est donc nécessaire de lancer ce serveur contenu dans le repertoire **Serveur/GraphesChartjs** avant d'exécuter le code contenu dans ce repertoire  




 
  
