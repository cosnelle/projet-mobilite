
# Bienvenue !

## Présentation

Etudiantes à Polytech Lille en cinquième année en Informatique et Statistique, je suis amenée à réaliser un projet nommé "Projet ingénieur". A l'aide de mon binôme, nous avons travaillé sur les données issues de l'enquête mobilité de l'Université de Lille.   
Ce dépôt nous permet d'afficher le site regroupant les représentations graphiques réalisées lors des sept semaines de projet.   

## Données utilisées

A terme nos graphiques seront utilisées sur les données issues de l'enquête mobilité de 2022 sur les étudiants de l'Université de Lille. Dans le cadre de notre projet, nous avons travaillé dans un premier temps sur un faux jeu de données généré à partir d'un script python. Puis, nous avons utilisé un jeu de données se rapprochant des vraies données. Ce jeu comporte 6 colonnes (variables : Etablissement, Catégorie, Mode, Distance, INSEE_DOM, INSEE_TRA) et 3123 lignes (individus).  

## Description des répertoires

Cette archive contient plusieurs répertoires:

- Le répertoire **Client** est composé de fichier html et css qui permettent l'affichage du site. Par exemple, le fichier index.html contient la page d'accueil du site;
- Le répertoire **Documents** regroupe les documents rédigés pendant notre projet : Compte-rendu de réunion (CR), cahier des charges, rapport intermédiaire;
- Le répertoire **Serveur** contient API REST utilisé.

## Site de visualisation

Afin de visualiser les graphiques réalisés, vous pouvez mettre en place en local un serveur web de visualisation. Pour cela, il faut télécharger les répertoires **Client** et **Serveur**.
Lancement de la commande suivante sur le port 3000:  
`` python 3 http serveur``  
Cette commande va permettre d'affciher les pages du serveur web.  
Parallèlement il faut aussi lancer la commande suivante sur un port différent par exemple le port 8000:  
``python 3 http serveur``  
Cette commande peremet de lancer en local l'API, pour la suite le l'initialisation de l'API il faut se rendre dans le README.md du répertoire Serveur.