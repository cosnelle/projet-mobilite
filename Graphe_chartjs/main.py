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


######## Fonction nombre mode de transport univ

def Nombre_mode_transport_univ(frame):

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
    
    liste_univ_data, w  = [], {}
    for i in range(len(liste_universite)): 
        z = {liste_universite[i] : (univ[i])}
        w = merge(w, z)
        liste_univ_data.append(w)
        w = {}
       
    data = { "data" : liste_univ_data }  
    return data


############### Fonction Distance(en km) mode de transport univ

def Distance_mode_transport_univ(frame):
    
    #Aggrégation Distance pour chaque mode de transport et université 
    res = pd.DataFrame(frame.groupby(["Etablissement", "Mode"], as_index = False)["Distance"].sum()) 
    res = res.groupby("Etablissement")
        
    liste_Mode_transport= list(res)[0][1].sort_values(["Mode"])["Mode"].tolist()

    liste_universite, liste_data = [], []
    for i in range(len(list(res.groups))):  
           universite = list(res)[i][0]  
           liste_data_univ = list(res)[i][1].sort_values(["Mode"])["Distance"].tolist()

           liste_universite.append(universite)
           liste_data.append(liste_data_univ) #Creation d'une liste de liste contenant les Distances par mode de transport  pour différents université  


    #Création données JSON pour chaque université
    univ, data_univ, y =  [None]*len(liste_universite), [], {}  
    for i in range(len(liste_universite)): 
          for j in range (len(liste_data[i])):   
             x =  { liste_Mode_transport[j] : liste_data[i][j]}
             y = merge(y, x)
          univ[i] = y
          y = {}
    
    liste_univ_data, w  = [], {}
    for i in range(len(liste_universite)): 
        z = {liste_universite[i] : (univ[i])}
        w = merge(w, z)
        liste_univ_data.append(w)
        w = {}
       
    data = { "data" : liste_univ_data }  
    return data 


########## Fonction Emission Co2(en kgCO2) mode de transport univ 


def Emission_Co2_mode_transport_univ(frame):

    #Fonctions calcul Co2 mode_transport univ
    def getCO2Bus(distance):
        return round(0.151 * distance,4)
    
    def getCO2MetroTramway(distance):
        return round(0.00329 * distance,4)
    
    def getCO2Pied(distance):
        return round(0.001 * distance,4)
    
    def getCO2Train(distance):
        if distance < 200:
            return round(0.018 * distance,4)
          
        return round(0.003 * distance,4)
    
    def getCO2Autre(distance):
        return round(0.024 * distance,4)
    
    def getCO2CarOil(distance):
        return round(0.223 * distance,4)
    
    def getCO2CarElec(distance): 
        return round(0.1 * distance,4)
    
    def getCO2Velo(distance):
        return round(0.0048 * distance,4)

    #Aggrégation Distance pour chaque mode de transport et université 
    res = pd.DataFrame(df.groupby(["Etablissement", "Mode"], as_index = False)["Distance"].sum()) 
    res = res.groupby("Etablissement")
    
    liste_Mode_transport= list(res)[0][1].sort_values(["Mode"])["Mode"].tolist()
    
    
    liste_universite, liste_data = [], []
    for i in range(len(list(res.groups))):  
            universite = list(res)[i][0] 
            liste_data_univ = list(res)[i][1].sort_values(["Mode"])["Distance"].tolist()
    
            liste_universite.append(universite)
            liste_data.append(liste_data_univ)  #Creation d'une liste de liste contenant les Distances par mode de transport  pour différents université  
    
    liste_data_Co2 = []
    Co2_km_mode_transport = []
    fonction_Co2 = [getCO2Bus, getCO2MetroTramway, getCO2Pied, getCO2Train, getCO2Autre, getCO2CarOil, getCO2CarElec, getCO2Velo]
    for i in range(len(liste_universite)):
      for j in range (len(liste_data[i])):     
           Co2_km_mode_transport.append(fonction_Co2[j](liste_data[i][j])) 
    
      liste_data_Co2.append(Co2_km_mode_transport)  ##Creation d'une liste de liste contenant les valeurs Co2 par mode de transport  pour différents université  
      Co2_km_mode_transport = []
    
    
    #Création données JSON pour chaque université
    univ, data_univ, y =  [None]*len(liste_universite), [], {}  
    for i in range(len(liste_universite)): 
              for j in range (len(liste_data_Co2[i])):   
                 x =  { liste_Mode_transport[j] : liste_data_Co2[i][j]}
                 y = merge(y, x)
              univ[i] = y
              y = {}
        
    liste_univ_data, w  = [], {}
    for i in range(len(liste_universite)): 
            z = {liste_universite[i] : (univ[i])}
            w = merge(w, z)
            liste_univ_data.append(w)
            w = {}
           
            data = { "data" : liste_univ_data }  
    
    return data

   
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


    





