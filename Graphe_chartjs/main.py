# main.py
from fastapi import  FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fonctions_main import *

import pandas as pd 


df = pd.read_json("fake-data-v2.json", orient='table')

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


    





