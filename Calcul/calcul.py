## fichier python de calcul

# creation des donnes generees aleaatoirement
# commande a lancer
#  >>>    & D:/Application/Anaconda/python.exe c:/Users/julie/Documents/projet-mobilite/Calcul/data-generation.py 100 data.json

# importation du fichier json
import json

with open('c:/Users/julie/Documents/projet-mobilite/Calcul/data.json') as my_file:
    data = json.load(my_file)

print(data) 

# convertir le fichier json en data frame
import pandas as pd

df = pd.read_json('C:/Users/julie/Documents/projet-mobilite/Calcul/data.json', orient='table')

# fonctions de calcul
# les fonctions sont faites a partir des coef issus de la base de l ADEME 2018

# calcul du rejet de CO2 pour les voitures toute motorisation
#   en kgCO2
def getCO2Car(distance):
  return 0.218 * distance

def getCO2CarOil(distance):
  return 0.223 * distance

# Revoir le calcul pour les voitures electriques
def getCO2CarElec(distance): 
  return 0.1 * distance

def getCO2Bus(distance, nbPers):
  return 0.151 * distance * nbPers

def getCO2MetroTramway(distance, nbPers):
  return 0.00329 * distance * nbPers

def getCO2TER(distance, nbPers):
  return 0.0313 * distance * nbPers

def getCO2TGV(distance, nbPers):
  return 0.00253 * distance * nbPers

# pour le calcul de l emprunte carbonne d un cyclisme
#   il faut calculer le cout de fabrication du velo
#  Source non fiable : 100kgCO2 pour un velo neuf
#  non prise en compte de l'emprunte carbonne d un velo mecanique

def getCO2VeloElec(distance):
  return 0.011 * distance

def getCO2Covoiturage(distance, fonction ,nbPers):
  return fonction(distance) /nbPers

# pour un être humain = 9gCO2 par km
#   dépense de calorie + alimentation

## tableau de comparaison des modes de transport par km
import numpy as np

voiture = np.zeros(10, float)
distance = np.zeros(10, int)
for i in range(0,10):
  voiture[i] = getCO2Car(i+1)
  distance[i]=i+1


# representation graphique
import matplotlib.pyplot as plt
import seanbord as sns

plt.title("Test")
plt.grid()
plt.plot(distance,voiture)
plt.show()

sns.scatterplot(distance,voiture)
plt.show()


