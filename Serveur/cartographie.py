#######     Projet Ingenieur PolytechLille  #########
# Annees universitaire 2022-2023
# Contributeurs : Cosnelle DJOUMEKOUM & Julie RIDOLFI
#####################################################

# FONCTIONS POUR LA CARTOGRAPHIE
import pandas as pd
import numpy as np
import requests

from calcul import *
from valeur_colonne import *


# FONCTIONS POUR LA CARTE


# Creation fonction qui calcul le nombre de personnes allant
#    d une commune a une autre
# 
#    @param file : data frame
#
#    @sortie
#           {"domicile" :  string ,
#            "travail" :  string  ,
#            "Nb_person"   int  }


def calcul_flux_deplacement(df):
    res = df.groupby(["INSEE_DOM", "INSEE_TRA"])["Usagers"].sum()
    x = []
    # Pour chaque element de l'aggregation
    #    recuperer les deux clefs
    #       + la valeur qui correspond a la somme du nombre de personnes qui
    #         vont de la commune domicile a la commune travail
    for i in range(len(res)):
        dep = {
            "domicile": str(res.keys()[i][0]),
            "travail": str(res.keys()[i][1]),
            "Nb_person": res.iloc[i],
        }
        x.append(dep)


    data = {"data": x}

    return data



# Creation d une fonction qui recupere les coordonnees geographiques
#                                    + le nom de la commune
#     a l aide de l api  https://geo.api.gouv.fr/
# @ param codePostal est un string : par exemple '59650'


def get_coordonnees(codePostal):
    # url de l api + codePostal recherche
    url_coordonnees = "https://geo.api.gouv.fr/communes?codePostal=" + codePostal + "&fields=centre"
    # recuperation du contenu de l url
    req = requests.get(url_coordonnees)
    wb = req.json()
    
    # if req est vide : cas où le codePostal est incorrect
    if len(wb) == 0:
        data = {}
    else:
        # convertir le json en data.frame
        codePostaldf = pd.json_normalize(wb)
        # decomposition
        nomCom = codePostaldf["nom"][0]
        lon, lat = codePostaldf["centre.coordinates"][0]
        data = {"codePostal": codePostal, "nom": nomCom, "coordonnees_centre": [lat, lon]}


    return data



# Fonction qui retourne l ensemble des trajets effectues par les etudiants
#   et personnnels de l universite + donne la somme des personnes qui font
#   ces trajets
#
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

def get_trajet(df):
    res = df.groupby(["INSEE_DOM", "INSEE_TRA"])["Usagers"].sum()
    x = []
    for i in range(len(res)):
        # recuperation des coordonnees du domicile
        domicile = get_coordonnees(str(res.keys()[i][0]))
        # recuperation des coordonnees du lieu de travail
        travail = get_coordonnees(str(res.keys()[i][1]))
        dep = {"domicile": domicile, "travail": travail, "Nb_person": res.iloc[i]}
        x.append(dep)

    data = {"data": x}
    
    return data

# nouvelle fonction : non utilisant dans l API
# Fonction qui recupere tous les coordonnees des communes utilisees dans la base
#   @param  df : correspond a la base de donnees

def get_coordonnees_communes_base(df):
    #
    df=df.assign(Usagers = 1.0)
    #selectionner les coordonnees des domiciles et des lieux de travail
    # selection domicile + travail : valeur unique pas de doublon
    a = df["INSEE_TRA"].unique() # travail
    b = df["INSEE_DOM"].unique() # domicile
    c = np.concatenate((a,b))
    # codePos correspond a tous les codes postaux de la base
    #         il ne contient aucun doublon
    codePos = np.unique(c)
    x=[]
    for i in range(len(codePos)):
      coordonnees = get_coordonnees(codePos[i])
      x.append(coordonnees)
    
    data = {"data": x}

    return data


# FONCTION POUR LE SANKEY


#  Fonction permettant l 'affichage du sankey (diagramme de flux)
#     recuperation des valeurs uniques du lieu de travail et du domicile
#     discretisation des codes postaux avec des entiers
#     pour chaque codePostal source et cible calcul la somme totale des
#     individus se deplacent entre ces deux communes
#
# format de donnees:
#
#    Nodes (noeud)
#       {liste de tous les noeuds}
#
#    Links
#       {source :   ,
#        target :   ,
#        value :    }


def get_source_target(df):
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
