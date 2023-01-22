
## Description du contenu du répertoire

Ce répertoire contient l'ensemble des programmes python permettant la réalisation des services de l'API REST. Nous avons donc les fichiers suivants :

- **calcul.py** : contenant les fonctions calculant la quantité de GES rejeté sur un trajet. Ces fonctions s'utilisent en indiquant la distance parcourue en km. Le résultat est donnée en kgCO2e;  
- **cartographie** : contenant les fonctions nécessaires à la réalisation de la carte du Nord de la France et au sankey. Une partie de ces fonctions font appeles à une API extérieure : https://geo.api.gouv.fr/ qui à partir d'un code postal nous retourne de le nom de la ville, sa longitude et sa latitude. Nous utilisons ces informations pour afficher les villes université et les villes de domicile des étudiants et des personnels de l'Université de Lille;
- **tableau** : contenant les fonctions nécessaires à l'affichage de la quantité annuelle de GES par mode de transport et tranche de distance;
- **foncions_main.py** : contenant les différentes fonctions utilisées pour réaliser les graphiques chartjs;
- **main.py** : contenant les services (endpoint) permettant de faire les aggrégations nécessaires à la création des différents graphiques chartjs, de la carte du Nord de la France, du sankey (diagramme des flux) et d'un tableau regroupant lesv sur un serveur d'API.  

Le fichiers main pourra être utilisé lors de l'éxécution de la demarche pour mettre en place d'un serveur d'API décrit ci dessous. Il permet de mettre sur le serveur D'API les routes suivantes:  
- Route permettant d'avoir les données brutes  
- Route permettant d'avoir les données sur les modes de transport en fonction des universités  
- Route permettant d'avoir les données sur les distance en fonction du mode de transport des universités  
- Route permettant d'avoir les données sur les émissions de CO2 en fonction du mode de transport et des universités  
- Route permettant d'avoir les données sur le nombre de personnes se déplacement d'une commune à une autre  
- Route permettant d'avoir les données sur les coordonnées géographiques d'une commune à partir de son code postal  
- Route permettant d'avoir les données sur les émissions de CO2 en fonction du mode de transport et de la distance parcourue  


## Lancement API

Pour lancer l'API, il faut que le jeu de données se situe au même endroit que tous fichiers de ce repertoire. Pour lancer le serveur Fast API, les commandes sont écrites ci-dessous.  

**FastAPI** est un framework web haute performance, open source, permettant de créer des APIs avec    
Python à partir de la version 3.6          

**Prérequis :**          
Installer  python          

**D�marche mise en place :**         
1.	Se placer dans un terminal et exécuter les commande suivantes :    

    - **pip install fastapi** : permet d'installer FastAPI   
    - **pip install uvicorn** : permet le lancer le serveur API en local   

2.	Créer ensuite son répertoire de travail et y ajouter un fichier .py dans le lequel le code python sera écrit  
Un exemple de fichier  **''main.py ''** contenant le code pour importer FastAPI et créer une route pour  obtenir nos données au format .json  depuis notre serveur API sera joint à ce document.  

3.	Se placer ensuite dans le répertoire de travail et lancer la commande suivante pour lancer le serveur FastAPI en local :  
**uvicorn main:app --reload**      
       On peut avoir une erreur de reconnaissance de la commande uvicorn par le terminal si on effectue l'installation sur windows, dans ce cas utiliser la commande :  
              **python -m uvicorn main:app --reload**  
        ou travailler dans un environnement de travail python :         
              &nbsp; &nbsp; - **python -m venv venv** : permet de créer un environnement de travail virtuel nommé venv   
              &nbsp; &nbsp; - **venv\Scripts\activate** : permet d'activer l'environnement de travail virtuel   
              &nbsp; &nbsp; - **deactivate** :  permet de désactiver l'environnement de travail   
        l'environnement de travail permet également d'éviter de télécharger les modules nécessaires     
        pour un projet directement sur son PC   

Le lien du serveur local sur lequel l'API est lancer est ensuite fourni : http://127.0.0.1:8000   


**A savoir :**   
http://127.0.0.1:8000/docs permet d'avoir de la documentation sur notre API 
