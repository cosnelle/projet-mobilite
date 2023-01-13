<div align ="left"><img src="https://www.geipi-polytech.org/sites/default/files/styles/logos_page/public/logos/logo%20polytech%20lille.jpg?itok=ukjtAzhs" width="200" height="120" /> <div align ="right"><img src="https://atlas-sport.univ-lille.fr/atlas/photos/UL-WEB-2014.jpg" width="200" height="100" /></div> 


&nbsp; 

&nbsp; 


<div align="center"><h1>Année universitaire 2022-2023</h1> </div>
<div align="center"><h1>$$\textcolor{blue}{\text{Projet ingénieur}}$$ </h1></div>

&nbsp;

<div align="center"><h1>Démarche </h1> </div>
<div align="center"> <h1>Mise en place FastAPI</h1> </div>

&nbsp;

&nbsp;

 Elèves : Cosnelle DJOUMEKOUM & Julie RIDOLFI   
*Diplôme d’ingénieur “Informatique et Statistique” - 5ème année*  

Tuteur école : Frédéric HOOGSTOEL     
*Enseignant universitaire à Polytech’Lille*   

Tuteur entreprise : Damien MARCHAL     
*Ingénieur de recherche CNRS*   


&nbsp;

| POLYTECH LILLE                          |   CRISTAL                                 |
| -------------                           |      -------------                        |
| Av. Paul Langevin - Cité Scientifique   |  Av. Henri Poincaré - Cité Scientifique   |
| 59650 Villeneuve d’Ascq                 |  59650 Villeneuve d’Ascq                  |
| (33) 03 28 76 73 60                     |                                           |
| (33) 03 28 76 73 61                     |                                           |
   
&nbsp;

----

&nbsp;


**FastAPI** est un framework web haute performance, open source, permettant de créer des APIs avec    
Python à partir de la version 3.6          

**Prérequis :**          
Installer  python          

**Démarche mise en place :**         
1.	Se placer dans un terminal et exécuter les commande suivantes :    

    - **pip install fastapi** : permet d’installer FastAPI   
    - **pip install uvicorn** : permet le lancer le serveur API en local   

2.	Créer ensuite son répertoire de travail et y ajouter un fichier .py dans le lequel le code python sera écrit  
Un exemple de fichier  **‘’main.py ‘’** contenant le code pour importer FastAPI et créer une route pour  obtenir nos données au format .json  depuis notre serveur API sera joint à ce document.  

3.	Se placer ensuite dans le répertoire de travail et lancer la commande suivante pour lancer le serveur FastAPI en local :  
**uvicorn main:app --reload**      
       On peut avoir une erreur de reconnaissance de la commande uvicorn par le terminal si on                  effectue l’installation sur windows, dans ce cas utiliser la commande :  
              **python -m uvicorn main:app --reload**  
        ou travailler dans un environnement de travail python :         
              &nbsp; &nbsp; - **python -m venv venv** : permet de créer un environnement de travail virtuel nommé venv   
              &nbsp; &nbsp; - **venv\Scripts\activate** : permet d’activer l’environnement de travail virtuel   
              &nbsp; &nbsp; - **deactivate** :  permet de désactiver l’environnement de travail   
        l’environnement de travail permet également d’éviter de télécharger les modules nécessaires     
        pour un projet directement sur son PC   

Le lien du serveur local sur lequel l’API est lancer est ensuite fourni : http://127.0.0.1:8000   


**A savoir :**   
http://127.0.0.1:8000/docs permet d’avoir de la documentation sur notre API 


&nbsp; 

<div align="center"> <h3> Description des fichiers contenus dans ce repertoire </h3> </div>  

&nbsp; 

Ce repertoire est constitué de 2 fichiers:   
    
**foncions_main.py** : Contenant les différentes fonctions utilisées dans le main  
**main.py** : permettant de mettre des données de création des différents chartjs sur un serveur d'API.  

Il s'agit là des deux fichiers qui ont été utilisés pour la mise des données de creation des différents graphes chartjs sur un serveur d'API.  
Le fichiers main pourra être utilisé lors de l'éxécution de la demarche pour mettre en place d'un serveur d'API décrit ci dessus. Il permet de mettre sur le serveur D'API les trois routes suivantes:  
    - Route permettant d'avoir les données brutes  
    - Route permettant d'avoir les données sur les modes de transport en fonction des universités  
    - Route permettant d'avoir les données sur les distance en fonction du mode de transport des universités  
    - Route permettant d'avoir les données sur les émissions de CO2 en fonction du mode de transport et des universités  
    

