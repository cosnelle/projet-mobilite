#######     Projet Ingenieur PolytechLille  #########
# Annees universitaire 2022-2023
# Contributeurs : Cosnelle DJOUMEKOUM & Julie RIDOLFI
#####################################################

# fonctions utilisees dans l API
import pandas as pd
import numpy as np

# FONCTION GENERALISTE


# Focntion qui a partir d'un data frame et d'un nom de colonne
#   retourne les valeurs de la colonne
#
#   @param  df   data frame
#   @param  colonne   string


def get_valeur_colonne(df, colonne):
    # recupere les valeur d une colonne
    res = df[str(colonne)].value_counts()
    # liste ou les valeurs de la colonne sont stockees
    x = []
    # boucle d'ajout des veleurs dans la structure finale
    for i in range(len(res)):
        col = str(res.keys()[i])
        x.append(col)

    data = {"data": x}

    return data

