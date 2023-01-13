# main.py
# commande de lancement
#  a lancer dans le repertoire de l API
# python -m uvicorn main:app --reload
import json

# bibliotheque qui permet de faire des requetes d une api
import requests
import pandas as pd
import numpy as np
from fastapi import FastAPI


from fonctions import *
from fonctions_carto import *
from fonctions_tab import *


# importation du fichier de données utilisé
df = pd.read_json("fake-data.json", orient="table")
# ajout d'une colonne au data frame pour pouvoir faire les aggrégations
df=df.assign(Usagers = 1.0)


app = FastAPI()  # creer un objet FastAPI


# page d accueil
@app.get("/")
async def home():
    return {"message": "Projet mobilite"}


# Service pour recuperre une table de contingence
#      utilisation de la fonction calcul_flux_deplacement
@app.get("/data_mobilite/geo/flux/person")
async def get_flux_deplacement():
    res = calcul_flux_deplacement(df)
    return res

# Service qui prend en parametre un code postal
#    et qui retourne les cordonnees via un code postal
#   utilisation de la fonction get_coordonnees()
#   @param   code postal   int
@app.get("/data_mobilite/geo/coordonnees/{codepostal}")
async def get_coordonnees_value(codepostal):
    res = get_coordonnees(codepostal)
    return res


# Service qui demande a l'utilisateur une colonne
# API affiche les valeurs possible de la colonne donnée
@app.get("/data_mobilite/label_colonne/{colonne}")
async def get_colonne_value(colonne):
    res = get_valeur_colonne(df,colonne)
    return res

########## A REVOIR  très lent ##############
# Service qui retourne le nombre de personnes par trajet
#     avec les coordonnees des villes enpruntees

#@app.get("/data_mobilite/geo/trajet/nbPers")
#async def get_trajet_nbPerson():
#    res = get_trajet(df)
#    return res


# creation d'une nouvelle route qui permet de representer un sankey diagram
@app.get("/data_mobilite/geo/flux/sankey")
async def get_data_for_sankey():
    res = get_source_target(df)
    return res


# Service données formatées pour l'affichage en tableau de type datatables
@app.get("/data_mobilite/tableau")
async def get_mode_nb_pers():
    res = get_nbpers_for_tab(df)
    return res


# nouveau service
# calcul des GES par mode de transport et tranche de distance
# utilisation des fonctions calculGES() et get_calculGES()
@app.get("/data_mobilite/tableau/calculCO2")
async def get_calculCO2_mode_distance():
    # calcul de tous les rejets de gaz a effet de serre
    df2 = calculGES(df)
    # mise en forme des donnees
    data = get_calculGES(df2)
    return data


# nouveau service spécifique à l'utilisation de la library DataTables js
@app.get("/data_mobilite/tableau_DataTables/calculCO2")
async def get_mode_distance_co2():
    res = get_GES_for_tab(df)
    return res
