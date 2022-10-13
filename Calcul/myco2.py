def getCo2FromTrainModel(distance):
    ##Mix entre émission TER (18) et TGV (3)... en gCO2e/km"""
    if distance < 200:
        return 18 * distance
    return 3 * distance

def getCo2FromCarModel(distance):
    ## 193 gCO2e/km/véhicule ; Base Carbone ADEME, moyenne nationale toutes distances, toutes carburations.
## Les données intègrent l�amont et la combustion du carburant. Comme pour les autres modes de transports, elles n�intègrent pas la fabrication des véhicules et les émissions liées aux infrastructures routières."""
    return 193 * distance

def getCo2FromElectricCarModel(distance):
    ##Trouver une source de donnée fiable. labo1.5 ?"""
    return 193 / 2.0 * distance

def getCo2FromPlaneModel(distance):
    ##en gCO2e/km Source https://labos1point5.org/ges-1point5/310"""
    if distance < 1000:
        return 141 * distance
    if distance < 3500:
        return 102 * distance
    return 82 * distance

def getCo2FromMetroModel(distance):
    ##en gCO2e/km, source: ? � retrouver """
    return 3.5*distance

def getCo2FromBusModel(distance):
    ##en source: ? � retrouver """
    return 146*distance

def getCo2FromBikeModel(distance):
    ##5 gCO2e/km, source: labo 1.5"""
    return 5*distance

def getCo2FromWalkingModel(distance):
    ##1 gCO2e/km, source: labo 1.5"""
    return 1*distance

