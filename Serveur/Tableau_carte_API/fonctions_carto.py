# FONCTIONS POUR LA CARTOGRAPHIE
import pandas as pd
import numpy as np
import requests

from calcul import *
from fonctions import *


# FONCTIONS POUR LA CARTE


# Creation fonction qui calcul les flux de déplacement
#    @param file : data frame
#
#    @sortie
#           {"domicile" :  string ,
#            "travail" :  string  ,
#            "Nb_person"   int  }


def calcul_flux_deplacement(df):
    # AGGREGATION : somme du nombre d'usagers par communes de domicile et de travail
    res = df.groupby(["INSEE_DOM", "INSEE_TRA"])["Usagers"].sum()
    # liste qui stocke le nombre de combinaison possible
    x = []
    # Pour chaque element de l'aggrégation
    #    recuperer les deux clefs
    #       + la valeur qui correspond à la somme du nombre de personnes qui
    #         vont de la commune domicile à la commune travail
    for i in range(len(res)):
        dep = {
            "domicile": str(res.keys()[i][0]),
            "travail": str(res.keys()[i][1]),
            "Nb_person": res.iloc[i],
        }
        x.append(dep)

    # resultat est stocké dans un tableau de nom data
    data = {"data": x}

    return data





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
    
    # if req est empty
    if len(wb) == 0:
        data = {}
    else:
        # convertir le json en data.frame
        codePostaldf = pd.json_normalize(wb)
        # decomposition
        nomCom = codePostaldf["nom"][0]
        lat = codePostaldf["centre.coordinates"][0][1]
        lon = codePostaldf["centre.coordinates"][0][0]
        data = {"codePostal": codePostal, "nom": nomCom, "coordonnees_centre": [lat, lon]}


    return data



# Fonction 
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

##  A REVOIR
def get_trajet(df):
    # AGGREGATION de la somme de personnes qui effectuent le trajet domicile-travail
    res = df.groupby(["INSEE_DOM", "INSEE_TRA"])["Usagers"].sum()
    # liste avec toutes les combinaisons
    x = []
    for i in range(len(res)):
        domicile = get_coordonnees(str(res.keys()[i][0]))
        travail = get_coordonnees(str(res.keys()[i][1]))
        dep = {"domicile": domicile, "travail": travail, "Nb_person": res.iloc[i]}
        x.append(dep)

    data = {"data": x}
    
    return data

# nouvelle fonction

# MODIF
# requettage une seule fois l api gouvernementale

# Fonction qui recupère tous les coordonnées des communes utilisées dans la base
#   @param  df : correspond à la base de données

def get_coordonnees_communes_base(df):
    #
    df=df.assign(Usagers = 1.0)
    #selectionner les coordonnées des domiciles et des lieux de travail
    # selection domicile + travail : valeur unique pas de doublon
    a = df["INSEE_TRA"].unique() # travail
    b = df["INSEE_DOM"].unique() # domicile
    c = np.concatenate((a,b))
    # codePos correspond à tous les codes postaux de la base
    #         il ne contient aucun doublon
    codePos = np.unique(c)
    
    # boucle for sur tous les codes postaux
    for i in range(len(codePos)):
      get_coordonnees(codePos[i])
    
    return df_coordonnees


# FONCTION POUR LE SANKEY


#  Fonction permettant l 'affichage du sankey (diagramme de flux)
#
# format de données:
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



