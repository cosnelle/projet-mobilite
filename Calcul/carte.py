#---------BIBLIOTHEQUES/MODULES---------
import folium
import webbrowser

#----------PROGRAMME PRINCIPAL----------
# Création d'une carte
carte= folium.Map(location=[46.548312, 3.287667],zoom_start=18)

# Ajout localisations et  marqueurs
accueilL = [46.548312, 3.287667]
folium.Marker(
    location=accueilL,
    popup='Accueil Lycée',
    icon=folium.Icon(color='blue')
    ).add_to(carte)

viescolaireL = [46.548090, 3.287684]
folium.Marker(
    location=viescolaireL,
    popup='Vie scolaire',
    icon=folium.Icon(color='darkred')
    ).add_to(carte)

adminL = [46.548390, 3.287769]
folium.Marker(
    location=adminL,
    popup='Administration',
    icon=folium.Icon(color='green', icon='glyphicon-folder-open')
    ).add_to(carte)

direct = [46.548478, 3.287887]
folium.Marker(
    location=direct,
    popup='Direction',
    icon=folium.Icon(color='darkgreen', icon='glyphicon-user')
    ).add_to(carte)

directA = [46.548810, 3.288412]
folium.Marker(
    location=directA,
    popup='Proviseur Adjoint',
    icon=folium.Icon(color='darkgreen', icon='glyphicon-user')
    ).add_to(carte)

secpedaL = [46.548754, 3.288479]
folium.Marker(
    location=secpedaL,
    popup='Secrétariat pédagogique',
    icon=folium.Icon(color='green')
    ).add_to(carte)

cdr = [46.548692, 3.288063]
folium.Marker(
    location=cdr,
    popup='Centre de Ressources',
    icon=folium.Icon(color='orange', icon='glyphicon-book')
    ).add_to(carte)

Infirm = [46.548086, 3.287389]
folium.Marker(
    location=Infirm,
    popup='Infirmerie',
    icon=folium.Icon(color='red', icon='glyphicon-plus-sign')
    ).add_to(carte)

amphi = [46.548069, 3.287935]
folium.Marker(
    location=amphi,
    popup='Amphithêatre',
    icon=folium.Icon(color='orange', icon='glyphicon-briefcase')
    ).add_to(carte)

salleinfoL = [46.548280, 3.287882]
folium.Marker(
    location=salleinfoL,
    popup='Salles informatiques',
    icon=folium.Icon(color='orange', icon='glyphicon-floppy-disk')
    ).add_to(carte)

burinfoL = [46.548209, 3.287514]
folium.Marker(
    location=burinfoL,
    popup='Bureau informatique',
    icon=folium.Icon(color='darkred', icon='glyphicon-floppy-disk')
    ).add_to(carte)

BatA = [46.548537, 3.288128]
folium.Marker(
    location=BatA,
    popup='Bâtiment A',
    icon=folium.Icon(color='darkpurple', icon='glyphicon-home')
    ).add_to(carte)

BatC = [46.548459, 3.289003]
folium.Marker(
    location=BatC,
    popup='Bâtiment C',
    icon=folium.Icon(color='darkpurple', icon='glyphicon-home')
    ).add_to(carte)

BatD = [46.549075, 3.288174]
folium.Marker(
    location=BatD,
    popup='Bâtiment D',
    icon=folium.Icon(color='darkpurple', icon='glyphicon-home')
    ).add_to(carte)

self = [46.547234, 3.286945]
folium.Marker(
    location=self,
    popup='Restauration',
    icon=folium.Icon(color='orange', icon='glyphicon-cutlery')
    ).add_to(carte)

Dortoir = [46.547622, 3.287714]
folium.Marker(
    location=Dortoir,
    popup='Dortoir',
    icon=folium.Icon(color='orange', icon='glyphicon-bell')
    ).add_to(carte)

# enregistrement et affichage de la carte
carte.save('C:/Users/julie/Documents/projet-mobilite/Calcul/index.html')
webbrowser.open('C:/Users/julie/Documents/projet-mobilite/Calcul/index.html')


# autre image
import io
from PIL import Image

img_data = carte._to_png(5)
img = Image.open(io.BytesIO(img_data))
img.save('C:/Users/julie/Documents/projet-mobilite/Calcul/image.png')


# autre
import folium as f
c = folium.Map(location=[46.078025, 6.409053])
c.save('C:/Users/julie/Documents/projet-mobilite/Calcul/index.html')
