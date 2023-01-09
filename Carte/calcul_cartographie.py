# calcul de cartographie
# chargement du fichier bano-59.csv
import csv
import pandas as pd
import requests


returnValue = res.to_csv('C:/Users/julie/Documents/projet-mobilite/Calcul/myfile.csv', header=['lat', 'lont'])



# importation des donnees
df = pd.read_json('C:/Users/julie/Documents/projet-mobilite/API/data.json', orient='table')
codePostal = '59650'
url_coordonnees ="https://geo.api.gouv.fr/communes?codePostal=" + codePostal + "&fields=centre"

req = requests.get(url_coordonnees)
wb = req.json()

print(wb)
# permet de passer du json a une base de donnees
codePostaldf = pd.json_normalize(wb)
codePostaldf

# Structure de donnees a partir du df
#  data = {"codePostal": codePostal, "nom": nomCom, "coordonnees_centre": [lat, lon]}

data = {"codePostal": codePostal, "nom": codePostaldf["nom"][0], 
"coordonnees_centre": [codePostaldf["centre.coordinates"][0][1], codePostaldf["centre.coordinates"][0][0]]}

# autre Structure de donnees
#   directement avec json


# calcul flux de deplacement
def calcul_flux_deplacement(file):
  df = pd.read_json(file, orient='table')
  res = df.groupby(['INSEE_DOM', 'INSEE_TRA'])["Usagers"].sum()
  x=[]
  for i in range(len(res)):
    dep = {"domicile" : str(res.keys()[i][0]), "travail" : str(res.keys()[i][1]) , "Nb_person" : res.iloc[i]}
    x.append(dep)

  data = {"data" : x} 
  
  return data

a = calcul_flux_deplacement('C:/Users/julie/Documents/projet-mobilite/API/data_test_correction.json')


df
res = df.groupby(['INSEE_DOM', 'INSEE_TRA'])["Usagers"].sum()
x=[]
for i in range(len(res)):
  domicile = 
  dep = {"domicile" : str(res.keys()[i][0]), "travail" : str(res.keys()[i][1]) , "Nb_person" : res.iloc[i]}
  x.append(dep)
  

# discretisation de valeur
# non possible d'importer sklearn pour le moment
from sklearn.preprocessing  import FunctionTransformer
#intervalles des classes et noms

labels = ['0-1', '1-2','2-5','5-10', '10-20', '20-50', '50-100', '100-200']

df_disc=data_to_discretize.copy() #copie du tableau à discrétiser
var_to_discretize=data_to_discretize.columns
for df,labels in zip(df,labels,var_to_discretize):
    transformer = FunctionTransformer( pd.cut, kw_args={'bins': bins , 'labels': labels , 'retbins': False})
    df_disc[var]=transformer.fit_transform(df_disc[var])

# deuxième option creation d une boucle
# 

# creation d'une nouvelle colonne avec les distances discrétisées
# trouver un autre code pour discrétiser plus rapidement ces distances
data_disc = df
data_disc=data_disc.assign(Distance_disc=" ")

for i in range(len(data_disc)):
  if data_disc["Distance"][i] < 4 :
    data_disc.loc[i, 'Distance_disc'] = 'distance_00-03'

  elif 3 < data_disc["Distance"][i] < 6 :
    data_disc.loc[i, 'Distance_disc'] = '03-05'
    
  elif 5 < data_disc["Distance"][i] < 11 :
     data_disc.loc[i, 'Distance_disc'] = '05-10'
     
  elif 10 < data_disc["Distance"][i] < 21 :
     data_disc.loc[i, 'Distance_disc'] = '10-20'
     
  elif 20 < data_disc["Distance"][i] < 51 :
     data_disc.loc[i, 'Distance_disc'] = '20-50'
     
  elif 50 < data_disc["Distance"][i] < 101 :
     data_disc.loc[i, 'Distance_disc'] = '50-100'
     
  elif data_disc["Distance"][i] > 100 :
     data_disc.loc[i, 'Distance_disc'] = '100-250'

# tableau de contingence entre les distances discretisées et le mode de transport
a = data_disc.groupby(["Mode", "Distance_disc"])["Usagers"].sum()

# realisation du service qui sera utilisé pour afficher le nombre de personnes 
#   par distance et mode de transport
# librairie à importer en plus
import numpy as np
# structre de données
#   Mode : { "intervalle1" : nbperson, "intervalle2" : nbperson, ...}
mode = np.unique(data_disc["Mode"].values)
w=[]
for i in range(len(mode)):
  data_mode = data_disc[data_disc.Mode== mode[i]]
  res = data_mode.groupby("Distance_disc")["Usagers"].sum()
  x={}
  for j in range(len(res)):
    y={str(res.keys()[j]) : res.iloc[j]} # erreur ici voir demain comment faire
    x.update(y)
  
  w.append(x)
  

data = {"mode" : mode , "data" : w} 


# autre type de structure
mode = np.unique(data_disc["Mode"].values)
w={}
for i in range(len(mode)):
  data_mode = data_disc[data_disc.Mode== mode[i]]
  res = data_mode.groupby("Distance_disc")["Usagers"].sum()
  x={}
  for j in range(len(res)):
    y={str(res.keys()[j]) : res.iloc[j]}
    x.update(y)
  
  v = {mode[i] : x}
  w.update(v)

data = {"data" : w} 
