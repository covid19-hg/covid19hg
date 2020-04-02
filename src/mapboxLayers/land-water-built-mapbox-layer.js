module.exports = (mapboxStreetMapSourceName) => ([
    {
        "id": "land-structure-polygon",
        "type": "fill",
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, built"
        },
        "source": mapboxStreetMapSourceName,
        "source-layer": "structure",
        "minzoom": 13,
        "filter": [
            "all",
            [
                "==",
                [
                    "geometry-type"
                ],
                "Polygon"
            ],
            [
                "==",
                [
                    "get",
                    "class"
                ],
                "land"
            ]
        ],
        "layout": {},
        "paint": {
            "fill-color": "hsl(185, 3%, 94%)"
        }
    },
    {
        "id": "land-structure-line",
        "type": "line",
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, built"
        },
        "source": mapboxStreetMapSourceName,
        "source-layer": "structure",
        "minzoom": 13,
        "filter": [
            "all",
            [
                "==",
                [
                    "geometry-type"
                ],
                "LineString"
            ],
            [
                "==",
                [
                    "get",
                    "class"
                ],
                "land"
            ]
        ],
        "layout": {
            "line-cap": "round"
        },
        "paint": {
            "line-width": [
                "interpolate",
                [
                    "exponential",
                    1.99
                ],
                [
                    "zoom"
                ],
                14,
                0.75,
                20,
                40
            ],
            "line-color": "hsl(185, 3%, 94%)"
        }
    }
])
