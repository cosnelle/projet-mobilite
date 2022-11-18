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

def calcul_nbutilis_modeTransport_univ(frame, Nom_colonne: str):
    glob = frame[Nom_colonne].value_counts()
    glob_label = glob.index.sort_values().tolist() 
    glob_data = glob.values.tolist()
    
    res = pd.DataFrame(frame.groupby(["Etablissement"], as_index = False)["Mode"].value_counts()) #Dataframe
    res = res.groupby("Etablissement") #transformer le dataframe en un DataframeGroupby(liste) objet afin de pouvoir récupérer les différents groupes
        

    liste_universite, liste_Mode_transport, liste_data = [], [], []
    for i in range(len(list(res.groups))):
           universite = list(res)[i][0]
           liste_transport_univ= list(res)[i][1].sort_values(["Mode"])["Mode"].sort_values().tolist()
           liste_data_univ = list(res)[i][1].sort_values(["Mode"])["count"].tolist()

           liste_universite.append(universite )
           liste_Mode_transport.append(liste_transport_univ)
           liste_data.append(liste_data_univ)

  
    liste_data_global = []
    for i in range(len(glob_label)):     
       glob_mode =  {"Mode_transport" : glob_label[i], "Nb_utilisateurs" : glob_data[i]}
       liste_data_global.append(glob_mode)

    
    univ, data_univ =  [None]*len(liste_universite), []
    for i in range(len(liste_universite)): 
          for j in range (len(liste_data[i])):    
             x =  {"Université": liste_universite[i],"Mode_transport" :liste_Mode_transport[i][j], "Nb_utilisateurs" : liste_data[i][j]}
             data_univ.append(x)
          univ[i] = data_univ
          data_univ = []  
    
    data = {"data" : { "nb_univ" : len(liste_universite), "Nb_utilisateurs_modeTransport_global" : liste_data_global,  "Nb_utilisateurs_modeTransport_univ": univ }} 
    return data
    
@app.get("/data_aggregation")  
async def get_data_aggregation():
    file = calcul_nbutilis_modeTransport_univ(df, "Mode")
    return file



  
    





