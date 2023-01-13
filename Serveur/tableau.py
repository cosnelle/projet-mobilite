#######     Projet Ingenieur PolytechLille  #########
# Annees universitaire 2022-2023
# Contributeurs : Cosnelle DJOUMEKOUM & Julie RIDOLFI
#####################################################

# FONCTIONS TABLEAU
import pandas as pd
import numpy as np

from calcul import *


# FONCTIONS POUR LE TABLEAU


# fonction qui descritise les distances parcourues
def discretisation(df):
    data_disc = df.assign(Distance_disc=" ")

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

# fonction qui calcul le rejet de GES de tous les individus d une base de donnees
#   retourne une nouvelle base de donnees avec une colonne qui calcul les GES sur
#   une annee : 205 j de travail * 2 * distance lieu travail-domicile
def calcul_ges(df):
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

        elif df_nouv.Mode[i] == "Trottinette/Autre":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Trotinette(df_nouv.Distance[i])
            )

        elif df_nouv.Mode[i] == "Voiture":
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
            
        elif df_nouv.Mode[i] == "Deux-roues motoris\u00e9es":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Moto(df_nouv.Distance[i])
            )
            
        elif df_nouv.Mode[i] == "Autre":
            df_nouv.loc[i, "Calcul_GES"] = (
                nb_jour * nb_trajet * getCO2Autre(df_nouv.Distance[i])
            )


    return df_nouv


# fonction qui permet de discretiser les distances et de calcul ges
def get_calcul_ges(df):
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

# Fonction qui recuperre les donnees a mettre dans le tableau
#    Nombre de pers par mode de transport et tranche de distance
#    @parm  df data frame
#
#    @ sortie
#        { mode :  "Bus",
#         data :   {distance1  : nbpers,
#                   distance2 :   nbpers,
#                     ....                    }
#         }
#

def get_nbpers_for_tab(df):
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


# Fonction qui retourne la quantite de GES par mode de transport
# et tranche de distance
def get_ges_for_tab(df):
    # calcul des GES
    df2 = calcul_ges(df)
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
