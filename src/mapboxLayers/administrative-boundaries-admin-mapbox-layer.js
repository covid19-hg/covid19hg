module.exports = (mapboxStreetSourceName) => ([
    {
        "id": "admin-1-boundary-bg",
        "type": "line",
        "metadata": {
            "mapbox:featureComponent": "admin-boundaries",
            "mapbox:group": "Administrative boundaries, admin"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "admin",
        "filter": [
            "all",
            [
                "==",
                [
                    "get",
                    "admin_level"
                ],
                1
            ],
            [
                "==",
                [
                    "get",
                    "maritime"
                ],
                "false"
            ],
            [
                "match",
                [
                    "get",
                    "worldview"
                ],
                [
                    "all",
                    "US"
                ],
                true,
                false
            ]
        ],
        "layout": {
            "line-join": "bevel"
        },
        "paint": {
            "line-color": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                8,
                "hsl(185, 0%, 84%)",
                16,
                "hsl(185, 0%, 84%)"
            ],
            "line-width": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                7,
                3.75,
                12,
                5.5
            ],
            "line-opacity": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                7,
                0,
                8,
                0.75
            ],
            "line-dasharray": [
                1,
                0
            ],
            "line-translate": [
                0,
                0
            ],
            "line-blur": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                3,
                0,
                8,
                3
            ]
        }
    },
    {
        "id": "admin-0-boundary-bg",
        "type": "line",
        "metadata": {
            "mapbox:featureComponent": "admin-boundaries",
            "mapbox:group": "Administrative boundaries, admin"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "admin",
        "minzoom": 1,
        "filter": [
            "all",
            [
                "==",
                [
                    "get",
                    "admin_level"
                ],
                0
            ],
            [
                "==",
                [
                    "get",
                    "maritime"
                ],
                "false"
            ],
            [
                "match",
                [
                    "get",
                    "worldview"
                ],
                [
                    "all",
                    "US"
                ],
                true,
                false
            ]
        ],
        "layout": {},
        "paint": {
            "line-width": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                3,
                3.5,
                10,
                8
            ],
            "line-color": "hsl(185, 0%, 84%)",
            "line-opacity": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                3,
                0,
                4,
                0.5
            ],
            "line-translate": [
                0,
                0
            ],
            "line-blur": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                3,
                0,
                10,
                2
            ]
        }
    },
    {
        "id": "admin-1-boundary",
        "type": "line",
        "metadata": {
            "mapbox:featureComponent": "admin-boundaries",
            "mapbox:group": "Administrative boundaries, admin"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "admin",
        "filter": [
            "all",
            [
                "==",
                [
                    "get",
                    "admin_level"
                ],
                1
            ],
            [
                "==",
                [
                    "get",
                    "maritime"
                ],
                "false"
            ],
            [
                "match",
                [
                    "get",
                    "worldview"
                ],
                [
                    "all",
                    "US"
                ],
                true,
                false
            ]
        ],
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-dasharray": [
                "step",
                [
                    "zoom"
                ],
                [
                    "literal",
                    [
                        2,
                        0
                    ]
                ],
                7,
                [
                    "literal",
                    [
                        2,
                        2,
                        6,
                        2
                    ]
                ]
            ],
            "line-width": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                7,
                0.75,
                12,
                1.5
            ],
            "line-opacity": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                2,
                0,
                3,
                1
            ],
            "line-color": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                3,
                "hsl(185, 0%, 83%)",
                7,
                "hsl(185, 3%, 68%)"
            ]
        }
    },
    {
        "id": "admin-0-boundary",
        "type": "line",
        "metadata": {
            "mapbox:featureComponent": "admin-boundaries",
            "mapbox:group": "Administrative boundaries, admin"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "admin",
        "minzoom": 1,
        "filter": [
            "all",
            [
                "==",
                [
                    "get",
                    "admin_level"
                ],
                0
            ],
            [
                "==",
                [
                    "get",
                    "disputed"
                ],
                "false"
            ],
            [
                "==",
                [
                    "get",
                    "maritime"
                ],
                "false"
            ],
            [
                "match",
                [
                    "get",
                    "worldview"
                ],
                [
                    "all",
                    "US"
                ],
                true,
                false
            ]
        ],
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "hsl(185, 0%, 67%)",
            "line-width": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                3,
                0.5,
                10,
                2
            ],
            "line-dasharray": [
                10,
                0
            ]
        }
    },
    {
        "id": "admin-0-boundary-disputed",
        "type": "line",
        "metadata": {
            "mapbox:featureComponent": "admin-boundaries",
            "mapbox:group": "Administrative boundaries, admin"
        },
        "source": mapboxStreetSourceName,
        "source-layer": "admin",
        "minzoom": 1,
        "filter": [
            "all",
            [
                "==",
                [
                    "get",
                    "disputed"
                ],
                "true"
            ],
            [
                "==",
                [
                    "get",
                    "admin_level"
                ],
                0
            ],
            [
                "==",
                [
                    "get",
                    "maritime"
                ],
                "false"
            ],
            [
                "match",
                [
                    "get",
                    "worldview"
                ],
                [
                    "all",
                    "US"
                ],
                true,
                false
            ]
        ],
        "layout": {
            "line-join": "round"
        },
        "paint": {
            "line-color": "hsl(185, 0%, 67%)",
            "line-width": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "zoom"
                ],
                3,
                0.5,
                10,
                2
            ],
            "line-dasharray": [
                "step",
                [
                    "zoom"
                ],
                [
                    "literal",
                    [
                        3.25,
                        3.25
                    ]
                ],
                6,
                [
                    "literal",
                    [
                        2.5,
                        2.5
                    ]
                ],
                7,
                [
                    "literal",
                    [
                        2,
                        2.25
                    ]
                ],
                8,
                [
                    "literal",
                    [
                        1.75,
                        2
                    ]
                ]
            ]
        }
    }
])
