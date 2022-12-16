# main.py
from fastapi import  FastAPI
import json
from jsonmerge import merge

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

def aggregation(frame):

    #Aggrégation mode de transport pour chaque université
    res = pd.DataFrame(frame.groupby(["Etablissement"], as_index = False)["Mode"].value_counts()) #Dataframe
    res = res.groupby("Etablissement") #transformer le dataframe en un DataframeGroupby(liste) objet afin de pouvoir récupérer les différents groupes
        
    liste_Mode_transport= list(res)[0][1].sort_values(["Mode"])["Mode"].tolist()

    liste_universite, liste_data = [], []
    for i in range(len(list(res.groups))):  #list(res.groups) retourne la liste des université
           universite = list(res)[i][0]  #list(res) retourne la liste des différents groupe formé lors de l'aggrégation
           liste_data_univ = list(res)[i][1].sort_values(["Mode"])["count"].tolist()

           liste_universite.append(universite)
           liste_data.append(liste_data_univ) #Creation d'une liste de liste contenant le Nb utilisateur pour différents université 


    #Création données JSON pour chaque université
    univ, data_univ, y =  [None]*len(liste_universite), [], {}  
    for i in range(len(liste_universite)): 
          for j in range (len(liste_data[i])):   
             x =  { liste_Mode_transport[j] : liste_data[i][j]}
             y = merge(y, x)
          univ[i] = y
          y = {}
    
    liste_univ, w  = [], {}
    for i in range(len(liste_universite)): 
        z = {liste_universite[i] : (univ[i])}
        w = merge(w, z)
        liste_univ.append(w)
        w = {}
       
    data = { "data" : liste_univ }  
    return data
   
@app.get("/mode_transport_univ")  
async def get_data_aggregation():
    file = aggregation(df)
    return file

    





