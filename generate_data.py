import pandas as pd
import googlemaps
from dotenv import load_dotenv
import os
import random

load_dotenv(dotenv_path="./.env.local")
client = googlemaps.Client(key=os.getenv("GOOGLE_API_KEY"))


def get_coords(name):
    geocode_result = client.geocode(name)
    result = geocode_result[0]["geometry"]["location"]
    return (result["lng"], result["lat"])


df = pd.read_csv(
    "./COVID-19hostgene_collection - Sheet1.csv",
    skiprows=[1],
    header=0,
    names=[
        "study_biobank",
        "coordinator",
        "email",
        "city_country",
        "prospective_retrospective",
        "expected_sample_size",
        "gwas",
        "wes",
        "wgs",
        "genotyping_done_at_fimm",
        "other_assays_planned",
        "notes",
    ]
)
raw_coords = [get_coords(x) for x in df["city_country"]]

adjusted_coords = []
for coord in raw_coords:
    if coord in adjusted_coords:
        # Add some noise to duplicate coords so that they appear as separate markers on the map:
        (lng, lat) = coord
        new_lng = lng + random.uniform(-0.01, 0.01)
        new_lat = lat + random.uniform(-0.01, 0.01)
        adjusted_coords.append((new_lng, new_lat))
    else:
        adjusted_coords.append(coord)

lngs = [coord[0] for coord in adjusted_coords]
lats = [coord[1] for coord in adjusted_coords]

df = df.assign(lat=lats, lng=lngs)
df = df[["lat", "lng", "study_biobank", "coordinator", "city_country"]]

json_string = df.to_json(orient="records")
with open("src/data.json", "w") as f:
    f.write(json_string)
