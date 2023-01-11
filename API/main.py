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


app = FastAPI()  # creer un objet FastAPI


# page d accueil
@app.get("/")
async def home():
    return {"message": "Projet mobilite"}


# Creation fonction qui calcul les flux de déplacement
def calcul_flux_deplacement(file):
    df = pd.read_json(file, orient="table")
    df=df.assign(Usagers = 1.0)
    res = df.groupby(["INSEE_DOM", "INSEE_TRA"])["Usagers"].sum()
    x = []
    for i in range(len(res)):
        dep = {
            "domicile": str(res.keys()[i][0]),
            "travail": str(res.keys()[i][1]),
            "Nb_person": res.iloc[i],
        }
        x.append(dep)

    data = {"data": x}

    return data


# Root pour recuperre une table de contingence
# utilisation de la fonction calcul_flux_deplacement
@app.get("/geo/flux/person")
async def get_flux_deplacement():
    file = calcul_flux_deplacement("fake-data.json")
    return file


# Creation d une fonction qui recupere les coordonnees geographiques
#                                    + le nom de la commune
# @ param codePostal est un string : par exemple '59650'
#   fonction qui fait appel a l api : https://geo.api.gouv.fr/


def get_coordonnees(codePostal):
    # url de l api
    url_coordonnees = (
        "https://geo.api.gouv.fr/communes?codePostal=" + codePostal + "&fields=centre"
    )
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


# service qui demande a l'utilisateur une colonne
# API affiche les valeurs possible de la colonne donnée
@app.get("/data_mobilite/label_colonne/{colonne}")
async def get_colonne_value(colonne):
    df = pd.read_json("fake-data.json", orient="table")
    res = df[str(colonne)].value_counts()
    x = []
    for i in range(len(res)):
        col = str(res.keys()[i])
        x.append(col)

    data = {"data": x}

    return data


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

# boucle for sur les elements de
#      calcul_flux_deplacement(file)
#   2 requetages :
#     - domicile
#     - travail


@app.get("/data_mobilite/geo/trajet/nbPers")
async def get_trajet_nbPerson():
    df = pd.read_json("fake-data.json", orient="table")
    df=df.assign(Usagers = 1.0)
    # selectionner les coordonnées des domiciles et des lieux de travail
    # selection domicile + travail : valeur unique pas de doublon
    a = df["INSEE_TRA"].unique() # travail
    b = df["INSEE_DOM"].unique() # domicile
    c = np.concatenate((a,b))
    # codePos correspond à tous les codes postaux de la base
    #         il ne contient aucun doublon
    codePos = np.unique(c)
    res = df.groupby(["INSEE_DOM", "INSEE_TRA"])["Usagers"].sum()
    x = []
    for i in range(len(res)):
        domicile = get_coordonnees(str(res.keys()[i][0]))
        travail = get_coordonnees(str(res.keys()[i][1]))
        dep = {"domicile": domicile, "travail": travail, "Nb_person": res.iloc[i]}
        x.append(dep)

    data = {"data": x}

    return data


# MODIF
# requettage une seule fois l api gouvernementale

# Fonction qui recupère tous les coordonnées des communes utilisées dans la base

def get_coordonnees_communes_base(df):
    #
    
    return df_coordonnees


# creation d'une nouvelle route qui permet de representer un sankey diagram
@app.get("/geo/flux/sankey")
async def get_data_for_sankey():
    df = pd.read_json("fake-data.json", orient="table")
    df=df.assign(Usagers = 1.0)
    # recuperation des lieux de travail
    node = []
    b = df["INSEE_TRA"].unique()
    for i in range(len(b)):
        a = str(b[i])
        node.append(a)
    # recuperation des lieux de domicile
    b = df["INSEE_DOM"].unique()
    for i in range(len(b)):
        a = str(b[i])
        node.append(a)
    # suppression des doublons
    node = list(set(node))
    # aggregation du nombre de personnes pour les trajets domicile-travail
    res = df.groupby(["INSEE_DOM", "INSEE_TRA"])["Usagers"].sum()
    x = []
    for i in range(len(res)):
        dep = {
            "source": int(node.index(str(res.keys()[i][0]))),
            "target": int(node.index(str(res.keys()[i][1]))),
            "value": res.iloc[i],
        }
        x.append(dep)
    # creation de la structure de donnees
    #   une partie qui contient tous les noeuds = codes postaux
    #   une autre parties avec tous les liens = code postal domicile, code postal travail, nb personnes
    data = {"nodes": node, "links": x}

    return data


# nouveau service pour le tableau
# fonction qui descritise les distances parcourues


def discretisation(df):
    data_disc = df
    data_disc = data_disc.assign(Distance_disc=" ")

    for i in range(len(data_disc)):
        if data_disc["Distance"][i] < 2:
            data_disc.loc[i, "Distance_disc"] = "d_00_01"
      
        elif 1 < data_disc["Distance"][i] < 4:
            data_disc.loc[i, "Distance_disc"] = "d_01_03"

        elif 3 < data_disc["Distance"][i] < 6:
            data_disc.loc[i, "Distance_disc"] = "d_03_05"

        elif 5 < data_disc["Distance"][i] < 11:
            data_disc.loc[i, "Distance_disc"] = "d_05_10"

        elif 10 < data_disc["Distance"][i] < 21:
            data_disc.loc[i, "Distance_disc"] = "d_10_20"

        elif 20 < data_disc["Distance"][i] < 51:
            data_disc.loc[i, "Distance_disc"] = "d_20_50"

        elif 50 < data_disc["Distance"][i] < 101:
            data_disc.loc[i, "Distance_disc"] = "d_50_100"

        elif data_disc["Distance"][i] > 100:
            data_disc.loc[i, "Distance_disc"] = "d__100_250"

    return data_disc


# fonction qui permet le calcul des GES
# importation des fonctions necessaires depuis un fichier .py
# disponible dans le même répertoire que ce fichier main.py
from calcul import *  # commande a eviter quand le fichier contient beaucoup de fonction

# fonction qui calcul le rejet de GES de tous les individus d une base de donnees
#   retourne une nouvelle base de donnees avec une colonne qui calcul les GES sur
#   une annee : 205 j de travail * 2 * distance lieu travail-domicile
def calculGES(df):
    # creation nouvelle colonne qui accueuil le calcul des GES
    #   INITIALISATION a 0
    df_nouv = df.assign(Calcul_GES=0)
    nb_jour = 205
    nb_trajet = 2
    # Parcourir toute la base de donnees pour faire le calcul pour chq indiv
    for i in range(len(df_nouv)):
        # condition en fonction du mode de transport
        if df_nouv.Mode[i] == "Bus":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Bus(df_nouv.Distance[i])
            )

        elif df_nouv.Mode[i] == "M\u00e9tro":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2MetroTramway(df_nouv.Distance[i])
            )

        elif df_nouv.Mode[i] == "Pi\u00e9ton":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Pied(df_nouv.Distance[i])
            )

        elif df_nouv.Mode[i] == "Train":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Train(df_nouv.Distance[i])
            )

        elif df_nouv.Mode[i] == "Trotinette/Autre":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Autre(df_nouv.Distance[i])
            )

        elif df_nouv.Mode[i] == "Voiture essence":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2CarOil(df_nouv.Distance[i])
            )

        elif df_nouv.Mode[i] == "Voiture \u00e9lectrique":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2CarElec(df_nouv.Distance[i])
            )

        elif df_nouv.Mode[i] == "V\u00e9lo":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Velo(df_nouv.Distance[i])
            )
            
        elif df_nouv.Mode[i] == "Deux-roues motoris\u00e9 : scooter, moto...":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Moto(df_nouv.Distance[i])
            )
            
        elif df_nouv.Mode[i] == "Autre":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Autre(df_nouv.Distance[i])
            )
            
        elif df_nouv.Mode[i] == "Trotinette":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Trotinette(df_nouv.Distance[i])
            )
            
        elif df_nouv.Mode[i] == "Skateboard":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Skateboard(df_nouv.Distance[i])
            )

    return df_nouv


# fonction qui permet de discretiser les distances et de calcul ges
def get_calculGES(df):
    # discretisation des distances
    data_disc = discretisation(df)
    # recuperation des modes de transport
    mode = np.unique(data_disc["Mode"].values)
    w = []  # tab des donnees
    tab = []  # tab des modes de transport
    for i in range(len(mode)):  # pour chaque mode de transport
        tab.append(mode[i])
        data_mode = data_disc[data_disc.Mode == mode[i]]
        res = data_mode.groupby("Distance_disc")["Calcul_GES"].mean()
        x = {}
        for j in range(len(res)):
            y = {str(res.keys()[j]): round(res.iloc[j], 3)}
            x.update(y)

        w.append(x)

    data = {"mode": tab, "data": w}

    return data


# nouv service
@app.get("/data_mobilite/tableau")
async def get_mode_nb_pers():
    df = pd.read_json("fake-data.json", orient="table")
    df=df.assign(Usagers = 1.0)
    data_disc = discretisation(df)
    mode = np.unique(data_disc["Mode"].values)
    w = []
    tab = []
    for i in range(len(mode)):
        tab.append(mode[i])
        data_mode = data_disc[data_disc.Mode == mode[i]]
        res = data_mode.groupby("Distance_disc")["Usagers"].sum()
        x = {}
        for j in range(len(res)):
            y = {str(res.keys()[j]): res.iloc[j]}
            x.update(y)

        w.append(x)

    data = {"mode": tab, "data": w}

    return data


# nouveau service
# calcul des GES par mode de transport et tranche de distance
# utilisation des fonctions calculGES() et get_calculGES()
@app.get("/data_mobilite/tableau/calculCO2")
async def get_calculCO2_mode_distance():
    df = pd.read_json("fake-data.json", orient="table")

    # calcul de tous les rejets de gaz a effet de serre
    df2 = calculGES(df)
    # mise en forme des donnees
    data = get_calculGES(df2)

    return data


# nouveau service spécifique à l'utilisation de la library DataTables js
@app.get("/data_mobilite/tableau_DataTables/CalculCO2")
async def get_mode_distance_co2():
    df = pd.read_json("fake-data.json", orient="table")
    df=df.assign(Usagers = 1.0)
    # calcul des GES
    df2 = calculGES(df)
    # discretisation
    data_disc = discretisation(df2)
    mode = np.unique(data_disc["Mode"].values)
    w = []
    for i in range(len(mode)):
        data_mode = data_disc[data_disc.Mode == mode[i]]
        res = data_mode.groupby("Distance_disc")["Calcul_GES"].mean()
        x = {"mode": mode[i]}
        for j in range(len(res)):
            v = {str(res.keys()[j]): round(res.iloc[j], 3)}
            x.update(v)

        w.append(x)

    data = {"data": w}

    return data
