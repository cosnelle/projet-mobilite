# main.py
# commande de lancement
#  a lancer dans le repertoire de l API
# python -m uvicorn main:app --reload
import json
import pandas as pd
from fastapi import FastAPI
from typing import Union

app = FastAPI()  #creer un objet FastAPI

@app.get("/")  
async def home():
    return {"message": "Projet mobilite"}

@app.get("/data_mobilite")
async def getData_mobilite():
    file = open('data_test.json')
    return json.load(file)

# calcul du nombre de personnes par universite
# fonction
def calcul_pers_univ(file):
  df = pd.read_json(file, orient='table')
  res=df.groupby("Etablissement")["Usagers"].sum()
  x=[]
  for i in range(len(res)):
    univ = {"Etablissement" : res.keys()[i], "Nb_person" : res[i]}
    x.append(univ)

  data = {"data" : x} 
  
  return data


# root pour connaitre le nombre de personnes par universite
@app.get("/univ")
async def get_nb_pers_univ():
  file = calcul_pers_univ('data_test_correction.json')
  return file

# Creation fonction qui calcul les flux de déplacement
def calcul_flux_deplacement(file):
  df = pd.read_json(file, orient='table')
  res = df.groupby(['INSEE_DOM', 'INSEE_TRA'])["Usagers"].sum()
  x=[]
  for i in range(len(res)):
    dep = {"domicile" : str(res.keys()[i][0]), "travail" : str(res.keys()[i][1]) , "Nb_person" : res.iloc[i]}
    x.append(dep)

  data = {"data" : x} 
  
  return data



@app.get("/geo/flux/person")
async def get_flux_deplacement():
  file = calcul_flux_deplacement('data_test_correction.json')
  return file

@app.get("/data_mobilite/label_colonne/{colonne}")
async def get_colonne_value(colonne):
  df = pd.read_json('data_test_correction.json', orient='table')
  res = df[str(colonne)].value_counts()
  x=[]
  for i in range(len(res)):
    lieu = {"domicile" : str(res.keys()[i])}
    x.append(lieu)
    
  lieu = {"lieu" : x}
  
  return lieu
