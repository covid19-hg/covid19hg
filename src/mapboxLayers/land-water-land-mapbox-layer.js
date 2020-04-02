module.exports = (mapboxStreetSourceName, mapboxTerrainSourceName) => ([
    {
        "id": "land",
        "type": "background",
        "source": mapboxTerrainSourceName,
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, land"
        },
        "layout": {},
        "paint": {
            "background-color": "hsl(185, 3%, 94%)"
        }
    },
    {
        "id": "landcover",
        "type": "fill",
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, land"
        },
        "source": mapboxTerrainSourceName,
        "source-layer": "landcover",
        "maxzoom": 7,
        "layout": {},
        "paint": {
            "fill-color": "hsl(185, 5%, 91%)",
            "fill-opacity": [
                "interpolate",
                [
                    "exponential",
                    1.5
                ],
                [
                    "zoom"
                ],
                2,
                0.3,
                7,
                0
            ],
            "fill-antialias": false
        }
    },
    {
        "id": "national-park",
        "type": "fill",
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, land"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "landuse_overlay",
        "minzoom": 5,
        "filter": [
            "==",
            [
                "get",
                "class"
            ],
            "national_park"
        ],
        "layout": {},
        "paint": {
            "fill-color": "hsl(185, 7%, 89%)",
            "fill-opacity": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                5,
                0,
                6,
                0.5,
                10,
                0.5
            ]
        }
    },
    {
        "id": "landuse",
        "type": "fill",
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, land"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "landuse",
        "minzoom": 5,
        "filter": [
            "match",
            [
                "get",
                "class"
            ],
            [
                "park",
                "airport",
                "glacier",
                "pitch",
                "sand"
            ],
            true,
            false
        ],
        "layout": {},
        "paint": {
            "fill-color": "hsl(185, 7%, 89%)",
            "fill-opacity": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                5,
                0,
                6,
                [
                    "match",
                    [
                        "get",
                        "class"
                    ],
                    "glacier",
                    0.5,
                    1
                ]
            ]
        }
    }
])
