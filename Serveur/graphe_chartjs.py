#######     Projet Ingenieur PolytechLille  #########
# Annees universitaire 2022-2023
# Contributeurs : Cosnelle DJOUMEKOUM & Julie RIDOLFI
#####################################################

#graphe_chartjs.py

# import library
import json
from jsonmerge import merge
import pandas as pd 


#fonction commun pour création des différents services
def mode_transport(objet) :
    liste_Mode_transport, liste = [],[]
    for i in range (len(list(objet.groups))):
       liste = list(objet)[i][1].sort_values(["Mode"])["Mode"].tolist()
       liste_Mode_transport.append(liste)
       liste = []
    return liste_Mode_transport


def liste_universite(objet):
    liste_universite =  []
    for i in range(len(list(objet.groups))):  #list(res.groups) retourne la liste des université
           universite = list(objet)[i][0]  #list(res) retourne la liste des différents groupe formé lors de l'aggrégation
           liste_universite.append(universite)
    return liste_universite 


def liste_data(objet, colonne : str):
    liste_data = []
    for i in range(len(list(objet.groups))):  #list(res.groups) retourne la liste des université
           liste_data_univ = list(objet)[i][1].sort_values(["Mode"])[colonne].tolist()
           liste_data.append(liste_data_univ) #Creation d'une liste de liste contenant le Nb utilisateur pour différents université 
    return liste_data


 #Création données JSON pour chaque université
def format_json(objet, colonne):
    univ, y =  [None]*len(liste_universite(objet)), {}  
    for i in range(len(liste_universite(objet))): 
          for j in range (len(liste_data(objet, colonne)[i])):   
             x =  { mode_transport(objet)[i][j] : liste_data(objet, colonne)[i][j]}
             y = merge(y, x)
          univ[i] = y
          y = {}
    liste_univ_data, w  = [], {}
    for i in range(len(liste_universite(objet))): 
        z = {liste_universite(objet)[i] : (univ[i])}
        w = merge(w, z)
        liste_univ_data.append(w)
        w = {}
    data = { "data" : liste_univ_data }
    return data  
 


######## Fonction nombre mode de transport univ
def nombre_mode_transport_univ(frame):
    #Aggrégation mode de transport pour chaque université
    res = pd.DataFrame(frame.groupby(["Etablissement"], as_index = False)["Mode"].value_counts()) #Dataframe
    res = res.groupby("Etablissement") #transformer le dataframe en un DataframeGroupby(liste) objet afin de pouvoir récupérer les différents groupes
    #Création données JSON pour chaque université
    data = format_json(res,"count" )
    return data




############### Fonction Distance(en km) mode de transport univ
def distance_mode_transport_univ(frame):
    #Aggrégation Distance pour chaque mode de transport et université 
    res = pd.DataFrame(frame.groupby(["Etablissement", "Mode"], as_index = False)["Distance"].sum()) 
    res = res.groupby("Etablissement")
    #Création données JSON pour chaque université
    data = format_json(res, "Distance")
    return data  


########## Fonction Emission Co2(en kgCO2) mode de transport univ par année.
#(mutipliaction par 205 pour avoir l'emission par année ) et 2 pour avoir deux trajets(aller/retour)

def fonction_Co2(str, distance):
    Co2 = 0

    def getCO2Autre(distance):   #pour l'instant on prend 0 pour la catégorie Autre
        return round( 2*205*0*distance,4) #Emission par année

    #Fonctions calcul Co2 mode_transport univ
    def getCO2Bus(distance):
        return round(2*205*0.151 * distance,4)  

    def getCO2DeuxRouesMotorisees(distance):
        return round( 2*205*0.1634* distance,4)
    
    def getCO2MetroTramway(distance):
        return round(2*205*0.00329 * distance,4)
    
    def getCO2Pied(distance):
        return round(2*205*0.001 * distance,4)
    
    def getCO2Train(distance):
        if distance < 200:
            return round(2*205*0.018 * distance,4)
          
        return round(2*205*0.003 * distance,4)
    
    def getCO2TrottinetteAutre(distance):
        return round(2*205*0.0195* distance,4)
    
    def getCO2CarOil(distance):
        return round(2*205*0.223 * distance,4)
    
    def getCO2CarElec(distance): 
        return round(2*205*0.1 * distance,4)
    
    def getCO2Velo(distance):
        return round(2*205*0.0048 * distance,4)
    
    def getCO2Voiture(distance):
        return getCO2CarOil(distance) + getCO2CarElec(distance)


    if(str == "Autre"):
            Co2 = getCO2Autre(distance)
        
    elif(str == "Bus"):
            Co2 = getCO2Bus(distance)

    elif(str == "Deux-roues motorisées"):
            Co2 = getCO2DeuxRouesMotorisees(distance)

    elif(str == "Métro"):
            Co2 = getCO2MetroTramway(distance)

    elif(str== "Piéton"):
            Co2 = getCO2Pied(distance)

    elif(str == "Train"):
            Co2 = getCO2Train(distance)

    elif(str == "Trotinette/Autre"):
            Co2 = getCO2TrottinetteAutre(distance)

    elif(str == "Voiture essence"):
            Co2 = getCO2CarOil(distance)

    elif(str == "Voiture électrique"):
            Co2 = getCO2CarElec(distance)
        
    elif(str == "Vélo"):
            Co2 =  getCO2Velo(distance)

    elif(str == "Voiture"):
            Co2 = getCO2Voiture(distance)  
    else :
          Co2 = 0
         
    return Co2


def emission_co2_mode_transport_univ(frame):
    #Aggrégation Distance pour chaque mode de transport et université 
    res = pd.DataFrame(frame.groupby(["Etablissement", "Mode"], as_index = False)["Distance"].sum()) 
    res = res.groupby("Etablissement")
    liste_data_Co2 = []
    Co2_km_mode_transport = []
    for i in range(len(mode_transport(res))):
      for j in range (len(liste_data(res,"Distance")[i])):     
           Co2_km_mode_transport.append(fonction_Co2(mode_transport(res)[i][j], liste_data(res,"Distance" )[i][j])) #appel des fonction si dessus sur les distance
      liste_data_Co2.append(Co2_km_mode_transport)  ##Creation d'une liste de liste contenant les valeurs Co2 par mode de transport  pour différents université  
      Co2_km_mode_transport = []
   #Création données JSON pour chaque université
    univ, y =  [None]*len(liste_universite(res)), {}  
    for i in range(len(liste_universite(res))): 
              for j in range (len(liste_data_Co2[i])):   
                 x =  { mode_transport(res)[i][j] : liste_data_Co2[i][j]}
                 y = merge(y, x)
              univ[i] = y
              y = {}
    liste_univ_data, w  = [], {}
    for i in range(len(liste_universite(res))): 
            z = {liste_universite(res)[i] : (univ[i])}
            w = merge(w, z)
            liste_univ_data.append(w)
            w = {}
            data = { "data" : liste_univ_data }  
    return data







    













    





