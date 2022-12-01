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

def aggregation(frame, Nom_colonne: str):
    #Aggrégation mode de transport pour tous les université
    glob = frame[Nom_colonne].value_counts().sort_index()
    glob_label = glob.index.tolist() 
    glob_data = glob.values.tolist()
    
    #Aggrégation mode de transport pour chaque université
    res = pd.DataFrame(frame.groupby(["Etablissement"], as_index = False)["Mode"].value_counts()) #Dataframe
    res = res.groupby("Etablissement") #transformer le dataframe en un DataframeGroupby(liste) objet afin de pouvoir récupérer les différents groupes
        

    liste_universite, liste_Mode_transport, liste_data = [], [], []
    for i in range(len(list(res.groups))):  #list(res.groups) retourne la liste des université
           universite = list(res)[i][0]  #list(res) retourne la liste des différents groupe formé lors de l'aggrégation
           liste_transport_univ= list(res)[i][1].sort_values(["Mode"])["Mode"].tolist()
           liste_data_univ = list(res)[i][1].sort_values(["Mode"])["count"].tolist()

           liste_universite.append(universite)
           liste_Mode_transport.append(liste_transport_univ)
           liste_data.append(liste_data_univ) #Creation d'une liste de liste contenant le Nb utilisateur pour différents université

    
    #Création données JSON pour tous les universités
    liste_data_global = []    
    for i in range(len(glob_label)):     
       glob_mode =  {glob_label[i] : glob_data[i]}
       liste_data_global.append(glob_mode)  


    #Création données JSON pour chaque université, creation d'une liste de liste contenant les données agrégées pour chaque université
    univ, data_univ =  [None]*len(liste_universite), []  
    for i in range(len(liste_universite)): 
          for j in range (len(liste_data[i])):   
             x =  {"Université": liste_universite[i], liste_Mode_transport[i][j] : liste_data[i][j]}
             data_univ.append(x)
          univ[i] = data_univ
          data_univ = []  

    #Aggrégation nombre de personne par université
    res1=frame.groupby("Etablissement")["Usagers"].sum()
    liste_person_univ=[]
    for i in range(len(res)):
        person_univ = {res1.keys()[i]: res1[i]} # utilisation de res.keys()[i] pour les labels,  res[i] pour les valeurs associées
        liste_person_univ.append(person_univ)
    
    data = { "data" : { "nb_univ" : len(liste_universite), "Nb_utilisateurs_modeTransport_global" : liste_data_global,  "Nb_utilisateurs_modeTransport_univ": univ, "nb_person_univ": liste_person_univ  }}
    return data

   
@app.get("/data_aggregation")  
async def get_data_aggregation():
    file = aggregation(df, "Mode")
    return file



  
    





