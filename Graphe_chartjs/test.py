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



Etab = df["Etablissement"].unique()
df_univ_Lille = df [ df["Etablissement"]  == Etab[0] ]
df_univ_Art = df [ df["Etablissement"]  == Etab[1] ]
df_univ_Val= df [ df["Etablissement"]  == Etab[2] ]


async def data_analysis(frame, Nom_colonne: str):   #Calcul le nombre d'utilisateur pour chaque moyen de transport
    dataf = frame[Nom_colonne].value_counts()
    labels_names = dataf.index.sort_values().tolist()
    data = dataf.values.tolist()
    retour_data = {"labels": labels_names, "data": data}
    return retour_data


@app.get("/data_aggregation")  
async def get_data_aggregation():
    Nb_utilisateurs_modeTransport_global= await data_analysis(df, "Mode")
    Nb_utilisateurs_modeTransport_univ_Lille = await data_analysis(df_univ_Lille, "Mode")
    Nb_utilisateurs_modeTransport_univ_Art = await data_analysis(df_univ_Art, "Mode", )
    Nb_utilisateurs_modeTransport_univ_Val = await data_analysis(df_univ_Val, "Mode")



    return {
        "data" :{ 
            "Nb_utilisateurs_modeTransport_global": Nb_utilisateurs_modeTransport_global,
            "Nb_utilisateurs_modeTransport_univ_Lille": Nb_utilisateurs_modeTransport_univ_Lille,
            "Nb_utilisateurs_modeTransport_univ_Art":  Nb_utilisateurs_modeTransport_univ_Art,
            "Nb_utilisateurs_modeTransport_univ_Val":  Nb_utilisateurs_modeTransport_univ_Val
            }
    
        }
    





