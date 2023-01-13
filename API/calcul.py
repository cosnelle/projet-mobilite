# fichier python des fonctions de calcul des GES
#         COEFFICIENTS issus de l'ADEME et du site labo 1.15
#         les calculs sont faits par trajet
#         pour avoir le rejet par année, il faut multiplier 
#         par 205 (jours)

# calcul du rejet de CO2 pour les voitures toute motorisation
#   en kgCO2


def getCO2Car(distance):
    return 0.218 * distance



def getCO2CarOil(distance):
    return 0.223 * distance

# Revoir le calcul pour les voitures electriques


def getCO2CarElec(distance): 
    return 0.1 * distance



def getCO2Bus(distance):
    return 0.151 * distance



def getCO2MetroTramway(distance):
    return 0.00329 * distance



def getCO2TER(distance):
    return 0.0313 * distance



def getCO2TGV(distance):
    return 0.00253 * distance



def getCO2Train(distance):
    if distance < 200:
        return 0.018 * distance
      
    return 0.003 * distance

# pour le calcul de l emprunte carbonne d un cyclisme
#   il faut calculer le cout de fabrication du velo
#  Source non fiable : 100kgCO2 pour un velo neuf
#  non prise en compte de l'emprunte carbonne d un velo mecanique


def getCO2VeloElec(distance):
    return 0.009 * distance


def getCO2Covoiturage(distance, fonction ,nbPers):
    return fonction(distance) / nbPers

# pour un être humain = 9gCO2 par km
#   dépense de calorie + alimentation
#   negligeable


def getCO2Pied(distance):
    return 0.001 * distance


def getCO2Velo(distance):
    return 0.0048 * distance


# verifier les coef
def getCO2Autre(distance):
    return 0.024 * distance


def getCO2Trotinette(distance):
    return 0.0195 * distance
  

def getCO2Moto(distance):
    return 0.1609 * distance
  
