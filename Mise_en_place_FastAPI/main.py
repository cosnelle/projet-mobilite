# main.py
import json
from fastapi import  FastAPI

import json

app = FastAPI()  #créer un objet FastAPI

@app.get("/")  
async def home():
    return {"message": "Projet mobilité"}

@app.get("/data_mobilite")
async def getData_mobilite():
    file = open('data_mobilite.json')   #Avoir un fichier data_mobilite_json dans le même répertoire
    return json.load(file)


