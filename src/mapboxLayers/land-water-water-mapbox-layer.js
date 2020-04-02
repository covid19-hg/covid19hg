module.exports = (mapboxStreetSourceName) => ([
    {
        "id": "waterway-shadow",
        "type": "line",
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, water"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "waterway",
        "minzoom": 8,
        "layout": {
            "line-cap": [
                "step",
                [
                    "zoom"
                ],
                "butt",
                11,
                "round"
            ],
            "line-join": "round"
        },
        "paint": {
            "line-color": "hsl(185, 5%, 75%)",
            "line-width": [
                "interpolate",
                [
                    "exponential",
                    1.3
                ],
                [
                    "zoom"
                ],
                9,
                [
                    "match",
                    [
                        "get",
                        "class"
                    ],
                    [
                        "canal",
                        "river"
                    ],
                    0.1,
                    0
                ],
                20,
                [
                    "match",
                    [
                        "get",
                        "class"
                    ],
                    [
                        "canal",
                        "river"
                    ],
                    8,
                    3
                ]
            ],
            "line-translate": [
                "interpolate",
                [
                    "exponential",
                    1.2
                ],
                [
                    "zoom"
                ],
                7,
                [
                    "literal",
                    [
                        0,
                        0
                    ]
                ],
                16,
                [
                    "literal",
                    [
                        -1,
                        -1
                    ]
                ]
            ],
            "line-translate-anchor": "viewport",
            "line-opacity": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                8,
                0,
                8.5,
                1
            ]
        }
    },
    {
        "id": "water-shadow",
        "type": "fill",
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, water"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "water",
        "layout": {},
        "paint": {
            "fill-color": "hsl(185, 5%, 75%)",
            "fill-translate": [
                "interpolate",
                [
                    "exponential",
                    1.2
                ],
                [
                    "zoom"
                ],
                7,
                [
                    "literal",
                    [
                        0,
                        0
                    ]
                ],
                16,
                [
                    "literal",
                    [
                        -1,
                        -1
                    ]
                ]
            ],
            "fill-translate-anchor": "viewport"
        }
    },
    {
        "id": "waterway",
        "type": "line",
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, water"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "waterway",
        "minzoom": 8,
        "layout": {
            "line-cap": [
                "step",
                [
                    "zoom"
                ],
                "butt",
                11,
                "round"
            ],
            "line-join": "round"
        },
        "paint": {
            "line-color": "hsl(185, 3%, 83%)",
            "line-width": [
                "interpolate",
                [
                    "exponential",
                    1.3
                ],
                [
                    "zoom"
                ],
                9,
                [
                    "match",
                    [
                        "get",
                        "class"
                    ],
                    [
                        "canal",
                        "river"
                    ],
                    0.1,
                    0
                ],
                20,
                [
                    "match",
                    [
                        "get",
                        "class"
                    ],
                    [
                        "canal",
                        "river"
                    ],
                    8,
                    3
                ]
            ],
            "line-opacity": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                8,
                0,
                8.5,
                1
            ]
        }
    },
    {
        "id": "water",
        "type": "fill",
        "metadata": {
            "mapbox:featureComponent": "land-and-water",
            "mapbox:group": "Land & water, water"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "water",
        "layout": {},
        "paint": {
            "fill-color": "hsl(185, 3%, 83%)"
        }
    }
])
