# calcul de cartographie
# chargement du fichier bano-59.csv
import csv
import pandas as pd
import requests
df=pd.read_csv("C:/Users/julie/Documents/projet-mobilite/Calcul/bano-59.csv", header = None)

res=df.groupby([3]).mean()

returnValue = res.to_csv('C:/Users/julie/Documents/projet-mobilite/Calcul/myfile.csv', header=['lat', 'lont'])



# importation des donnees
df = pd.read_json('C:/Users/julie/Documents/projet-mobilite/Calcul/data.json', orient='table')
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

