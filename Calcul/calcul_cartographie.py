# calcul de cartographie
# chargement du fichier bano-59.csv
import csv
import pandas as pd
df=pd.read_csv("C:/Users/julie/Documents/projet-mobilite/Calcul/bano-59.csv", header = None)

res=df.groupby([3]).mean()

returnValue = res.to_csv('C:/Users/julie/Documents/projet-mobilite/Calcul/myfile.csv', header=['lat', 'lont'])


