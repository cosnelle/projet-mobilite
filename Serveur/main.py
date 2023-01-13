#######     Projet Ingenieur PolytechLille  #########
# Annees universitaire 2022-2023
# Contributeurs : Cosnelle DJOUMEKOUM & Julie RIDOLFI
#####################################################

# main.py

# Bibliotheques a importer
from fastapi import  FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fonctions_main import *
from valeur_colonne import *
from cartographie import *
from tableau import *

import pandas as pd 
import json
import numpy as np

# importation du fichier de donnees utilisees
df = pd.read_json("fake-data-v2.json", orient="table")
# ajout d'une colonne au data frame pour pouvoir faire les aggregations
df=df.assign(Usagers = 1.0)

app = FastAPI()  #créer un objet FastAPI


app.add_middleware(
    CORSMiddleware,   # Cors permet d'autoriser l'accès à des ressources d'origine différente ( ex requêtes fetch sur serveur API)
    allow_origins=["*"] , #permet d'éviter les erreurs d'accès au serveur API lors du fetch
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)    

@app.get("/")  #endpoint
async def home():
    return {"message": "Projet mobilité"}

@app.get("/data_mobilite")
async def getData_mobilite():
    file = open('fake-data-v2.json')   #Avoir un fichier data_mobilite_json dans le même répertoire
    return json.load(file)


@app.get("/Nombre_mode_transport_univ")  
async def get_Nombre_mode_transport_univ():
    file = Nombre_mode_transport_univ(df)
    return file


@app.get("/Distance_mode_transport_univ_km")  
async def get_mode_transport_univ():
    file = Distance_mode_transport_univ(df)
    return file

@app.get("/Emission_Co2_mode_transport_univ_kgCo2")  
async def get_Emission_Co2_mode_transport_univ():
    file = Emission_Co2_mode_transport_univ(df)
    return file

    
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
# API affiche les valeurs possible de la colonne donnee
@app.get("/data_mobilite/label_colonne/{colonne}")
async def get_colonne_value(colonne):
    res = get_valeur_colonne(df,colonne)
    return res


# Service permettant de representer un sankey diagramme
@app.get("/data_mobilite/geo/flux/sankey")
async def get_data_for_sankey():
    res = get_source_target(df)
    return res


# Service donnees formatees pour l'affichage en tableau de type datatables
@app.get("/data_mobilite/tableau")
async def get_mode_nb_pers():
    res = get_nbpers_for_tab(df)
    return res



# Service calcul des GES par mode de transport et tranche de distance
# utilisation des fonctions calculGES() et get_calculGES()
@app.get("/data_mobilite/tableau/calculCO2")
async def get_calculCO2_mode_distance():
    # calcul de tous les rejets de gaz a effet de serre
    df2 = calcul_ges(df)
    # mise en forme des donnees
    data = get_calcul_ges(df2)
    return data


# Service specifique a l'utilisation de la library DataTables js
@app.get("/data_mobilite/tableau_DataTables/calculCO2")
async def get_mode_distance_co2():
    res = get_ges_for_tab(df)
    return res





