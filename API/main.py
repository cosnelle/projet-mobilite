# main.py
# commande de lancement
#  a lancer dans le repertoire de l API
# python -m uvicorn main:app --reload
import json
# bibliotheque qui permet de faire des requetes d une api
import requests
import pandas as pd
import numpy as np
from fastapi import FastAPI
from typing import Union

app = FastAPI()  #creer un objet FastAPI

# page d accueil
@app.get("/")  
async def home():
    return {"message": "Projet mobilite"}

# jeu de donnees utilise
@app.get("/data_mobilite")
async def getData_mobilite():
    file = open('data_test.json')
    return json.load(file)


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


# Root pour recuperre une table de contingence
# utilisation de la fonction calcul_flux_deplacement
@app.get("/geo/flux/person")
async def get_flux_deplacement():
  file = calcul_flux_deplacement('data_test_correction.json')
  return file

# Creation d une fonction qui recupere les coordonnees geographiques
#                                    + le nom de la commune
# @ param codePostal est un string : par exemple '59650'
#   fonction qui fait appel a l api : https://geo.api.gouv.fr/

def get_coordonnees(codePostal):
  # url de l api
  url_coordonnees ="https://geo.api.gouv.fr/communes?codePostal=" + codePostal + "&fields=centre"
  # recuperation du contenu de l url
  req = requests.get(url_coordonnees)
  wb = req.json()
  # convertir le json en data.frame
  codePostaldf = pd.json_normalize(wb)
  # decomposition
  nomCom = codePostaldf["nom"][0]
  lat = codePostaldf["centre.coordinates"][0][1]
  lon = codePostaldf["centre.coordinates"][0][0]
  
  data = {"codePostal": codePostal, "nom": nomCom, "coordonnees_centre": [lat, lon]}
  
  return data

# route qui retourne les cordonnees via un code postal
#   utilisation de la fonction get_coordonnees()
@app.get("/data_mobilite/geo/coordonnees/{codepostal}")
async def get_coordonnees_value(codepostal):
  res = get_coordonnees(codepostal)
  return res


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


# creation route qui recupere tous les trajets effectues
# Structure de donnees envoyees
#    {"domicile" : {"codePostal" : "",
#                  "nom" : "",
#                  "coordonnees_centre" : [lat, lon]
#                },
#     "travail" : {"codePostal" : "",
#                  "nom" : "",
#                  "coordonnees_centre" : [lat, lon]
#                },
#      "nbPerson" : 
#    }

# boucle for fur les elements de 
#      calcul_flux_deplacement(file)
#   2 requetages :
#     - domicile
#     - travail

@app.get("/data_mobilite/geo/trajet/nbPers")
async def get_trajet_nbPerson():
  df = pd.read_json('data_test_correction.json', orient='table')
  res = df.groupby(['INSEE_DOM', 'INSEE_TRA'])["Usagers"].sum()
  x=[]
  for i in range(len(res)):
    domicile = get_coordonnees(str(res.keys()[i][0]))
    travail = get_coordonnees(str(res.keys()[i][1]))
    dep = {"domicile" : domicile, "travail" : travail , "Nb_person" : res.iloc[i]}
    x.append(dep)
  
  data = {"data" : x}
  
  return data


# creation d'une nouvelle route qui permet de representer un sankey diagram
@app.get("/geo/flux/sankey")
async def get_data_for_sankey():
  df = pd.read_json('data_test_correction.json', orient='table')
  # recuperation des lieux de travail
  node=[]
  b=df["INSEE_TRA"].unique()
  for i in range(len(b)):
    a =str(b[i])
    node.append(a)
  # recuperation des lieux de domicile  
  b=df["INSEE_DOM"].unique()
  for i in range(len(b)):
    a = str(b[i])
    node.append(a)
  # suppression des doublons
  node = list(set(node))
  # aggregation du nombre de personnes pour les trajets domicile-travail
  res = df.groupby(['INSEE_DOM', 'INSEE_TRA'])["Usagers"].sum()
  x=[]
  for i in range(len(res)):
    dep = {"source" : int(node.index(str(res.keys()[i][0]))), "target" : int(node.index(str(res.keys()[i][1]))) , "value" : res.iloc[i]}
    x.append(dep)
  # creation de la structure de donnees
  #   une partie qui contient tous les noeuds = codes postaux
  #   une autre parties avec tous les liens = code postal domicile, code postal travail, nb personnes
  data = {"nodes" : node, "links" : x} 
  
  return data


