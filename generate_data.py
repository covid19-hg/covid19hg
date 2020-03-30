import pandas as pd
import googlemaps
from dotenv import load_dotenv
import os
import random
import json

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
        "coordinator",
        "study_biobank",
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

label_coords = []
marker_coords = []
for coord in raw_coords:
    if coord in label_coords:
        # Add some noise to duplicate coords so that they appear as separate markers on the map:
        (lng, lat) = coord
        new_lng = lng + random.uniform(-0.01, 0.01)
        new_lat = lat + random.uniform(-0.01, 0.01)
        label_coords.append((new_lng, new_lat))
    else:
        label_coords.append(coord)
    marker_coords.append(coord)

label_lngs = [coord[0] for coord in label_coords]
label_lats = [coord[1] for coord in label_coords]
marker_lngs = [coord[0] for coord in marker_coords]
marker_lats = [coord[1] for coord in marker_coords]

df = df.assign(lat=marker_lats, lng=marker_lngs,
               label_lat=label_lats, label_lng=label_lngs, id=df.index.astype(str))
marker_df = df[["lat", "lng", "study_biobank",
                "coordinator", "city_country", "id"]]
label_df = df[["label_lat", "label_lng", "study_biobank", "id"]]

json_string = marker_df.to_json(orient="records")
with open("src/data.json", "w") as f:
    f.write(json_string)

geojson_features = [
    {
        "type": "Feature",
        "id": x[4],
        "properties": {
            "study_biobank": x[3],
        },
        "geometry": {
            "type": "Point",
            "coordinates": [x[2], x[1]]
        }
    }
    for x in label_df.itertuples()]
geojson = {
    "type": "FeatureCollection",
    "features": geojson_features
}
with open("mapbox-studio-data.geojson", "w") as f:
    json.dump(geojson, f)
