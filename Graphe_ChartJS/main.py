# main.py
from fastapi import  FastAPI
import json

import pandas as pd 
from fastapi.middleware.cors import CORSMiddleware

df = pd.read_json("data_mobilite.json", orient='table')

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
    file = open('data_mobilite.json')   #Avoir un fichier data_mobilite_json dans le même répertoire
    return json.load(file)


async def data_analysis(Nom_colonne: str, titre : str):   #Calcul le nombre d'utilisateur pour chaque moyen de transport
    dataf = df[Nom_colonne].value_counts()
    labels_names = dataf.index.tolist()
    data = dataf.values.tolist()
    retour_data = {"labels": labels_names, "data": data, "label": titre}
    return retour_data


@app.get("/data_aggregation")  
async def get_data_aggregation():
    Nb_utilisateurs_modeTransport = await data_analysis("Mode", "nb_utilisateurs")
    return {
        "data" : {
            "Nb_utilisateurs_modeTransport": Nb_utilisateurs_modeTransport
            }
        }
    





