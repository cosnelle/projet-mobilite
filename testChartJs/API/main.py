# main.py
# commande de lancement
#  a lancer dans le repertoire de l API
# python -m uvicorn main:app --reload
import json
import pandas as pd
from fastapi import  FastAPI

import json

app = FastAPI()  #créer un objet FastAPI

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
  # boucle de creation du dictionnaire
  dictionnaire = []
  for idx, name in enumerate(df['Etablissement'].value_counts().index.tolist()):
	  res = {
	    "Etablissement": name,
      "Nb_person" : int(df['Etablissement'].value_counts()[idx])
	  }
	  dictionnaire.append(res)
	
  data = {
	  "data" : dictionnaire
  }
  # ecriture de la sortie dans un fichier json
  with open('univ2.json', 'wt') as my_file:
	  json.dump(data, my_file, indent=4)
  # revoyer en sortie le fichier json
  with open('univ2.json', 'r') as my_file:
    file = json.load(my_file)
  
  return file



# root pour connaitre le nombre de personnes par universite
@app.get("/univ")
async def get_nb_pers_univ():
  file = calcul_pers_univ('data_test.json')
  return file

