###
## Generates synthetic data 
## 
import json
import random
import sys 

etablissements = ["Université de Lille", "Université Artois", "Université Valencienne"]
categories = ["Enseignant"] + ["Biatss"] + ["Etudiant"]*3 
modes_de_transport = ["Voiture essence", "Voiture électrique", "Métro", "Train", "Bus", "Vélo", "Trotinette/Autre", "Piéton"]
insee_lieu_de_domicile = [59500,59129,59553,59350,62132] 
insee_lieu_de_travail = [59000,59650,59350,59491,59300]

if len(sys.argv) != 3:
	print("USAGE: data-generation.py number-of-samples outfile.json")
	sys.exit(-1)

entries = []
for i in range(0,int(sys.argv[1])):
	entry = {
		"Etablissement" : random.choice(etablissements),
		"Cat\u00e9gorie" : random.choice(categories),
		"Mode" : random.choice(modes_de_transport),
		"INSEE_DOM" : random.choice(insee_lieu_de_domicile),
		"INSEE_TRA" : random.choice(insee_lieu_de_travail),
		"Distance" : random.randint(1, 250),
		"Usagers" : 1.0
	}
	entries.append(entry)
	
data = {
	"schema": {
	        "fields": [
	            {
	                "name": "Etablissement",
	                "type": "string"
	            },
	            {
	                "name": "Cat\u00e9gorie",
	                "type": "string"
	            },
	            {
	            	"name" : "Mode",
	            	"type" : "string"	            
	            },
	            {
	                "name": "INSEE_DOM",
	                "type": "integer"
	            },
	            {
	                "name": "INSEE_TRA",
	                "type": "integer"
	            },
	            {
	                "name": "Distance",
	                "type": "number"
	            }
	      ]
	},
	"data" : entries
}

with open(sys.argv[2], "wt") as outfile:
	json.dump(data, outfile, indent=4)
