
## Description du contenu du répertoire

Ce répertoire contient les fichiers qui permettent de créer les services liés à la Cartographie (carte et sankey) et au tableau de la quantité de GES en fonction du mode de transport et de la distance pour une personne.  

- Le fichier calcul.py contient les fonctions calculant la quantité de GES rejeté sur un trajet. Ces fonctions s'utilisent en indiquant la distance parcourue en km. Le résultat est donnée en kgCO2e.  
- Le fichier main.py contient les services (endpoint) permettant de faire des agrégations nécessaires à l'affichage de la carte, du sankey et du tableau.  
Pour lancer l'API, il faut que le jeu de données se situe au même endroit que les fichiers main.py et calcul.py. Pour lancer le serveur Fast API, les commandes sont écrites dans la branche "Fast_API" du dépôt.  
Notons :


**FastAPI** est un framework web haute performance, open source, permettant de créer des APIs avec    
Python à partir de la version 3.6          

**Prérequis :**          
Installer  python          

**Démarche mise en place :**         
1.	Se placer dans un terminal et exécuter les commande suivantes :    

    - **pip install fastapi** : permet d'installer FastAPI   
    - **pip install uvicorn** : permet le lancer le serveur API en local   

2.	Créer ensuite son répertoire de travail et y ajouter un fichier .py dans le lequel le code python sera écrit  
Un exemple de fichier  **''main.py ''** contenant le code pour importer FastAPI et créer une route pour  obtenir nos données au format .json  depuis notre serveur API sera joint à ce document.  

3.	Se placer ensuite dans le répertoire de travail et lancer la commande suivante pour lancer le serveur FastAPI en local :  
**uvicorn main:app --reload**      
       On peut avoir une erreur de reconnaissance de la commande uvicorn par le terminal si on                  effectue l'installation sur windows, dans ce cas utiliser la commande :  
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