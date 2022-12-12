Ce repertoire est constitué de 4 fichiers:

**data_mobilite.json** : Contenant les données au format JSON      
**index.html** : Contenant le code html pour lancer des différents   graphique sur un serveur local.    
**index.js** : qui contient le code pour créer les différents graphique  chartjs en javascript  
**main.js** : Contenant le code pour lancer le serveur API (FastAPI) et  agréger les données en python.  

Pour exécuter le code de cette branche, l'utilisateur doit être améné a lancer l'API (FastAPI) sur un serveur local.    

Demarche pour lancer l'API:    
**FastAPI** est un framework web haute performance, open source, permettant de créer des APIs avec      
Python à partir de la version 3.6            

**Prérequis :**            
Installer  python            

**Démarche mise en place :**           
1.	Se placer dans un terminal et exécuter les commande suivantes :      

    - **pip install fastapi** : permet d’installer FastAPI     
    - **pip install uvicorn** : permet le lancer le serveur API en local      

2.	Créer ensuite son répertoire de travail et y ajouter un fichier .py dans le lequel le code python sera écrit    
Un exemple de fichier  **‘’main.py ‘’** contenant le code pour importer FastAPI et créer une route pour  obtenir nos données au format .json  depuis notre serveur   API sera joint à ce document.      

3.	Se placer ensuite dans le répertoire de travail et lancer la commande suivante pour lancer le serveur FastAPI en local :      
**uvicorn main:app --reload**        
       On peut avoir une erreur de reconnaissance de la commande uvicorn par le terminal si on effectue l’installation sur windows,  
dans ce cas utiliser la commande :     
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