module.exports = (mapboxStreetSourceName) => ([
  {
      "id": "settlement-subdivision-label",
      "type": "symbol",
      "metadata": {
          "mapbox:featureComponent": "place-labels",
          "mapbox:group": "Place labels, place-labels"
      },
      "source": mapboxStreetSourceName,
      "source-layer": "place_label",
      "minzoom": 10,
      "maxzoom": 15,
      "filter": [
          "all",
          [
              "==",
              [
                  "get",
                  "class"
              ],
              "settlement_subdivision"
          ],
          [
              "<=",
              [
                  "get",
                  "filterrank"
              ],
              4
          ]
      ],
      "layout": {
          "text-field": [
              "coalesce",
              [
                  "get",
                  "name_en"
              ],
              [
                  "get",
                  "name"
              ]
          ],
          "text-transform": "uppercase",
          "text-font": [
              "DIN Pro Regular",
              "Arial Unicode MS Regular"
          ],
          "text-letter-spacing": [
              "match",
              [
                  "get",
                  "type"
              ],
              "suburb",
              0.15,
              0.1
          ],
          "text-max-width": 7,
          "text-padding": 3,
          "text-size": [
              "interpolate",
              [
                  "cubic-bezier",
                  0.5,
                  0,
                  1,
                  1
              ],
              [
                  "zoom"
              ],
              11,
              [
                  "match",
                  [
                      "get",
                      "type"
                  ],
                  "suburb",
                  11,
                  10.5
              ],
              15,
              [
                  "match",
                  [
                      "get",
                      "type"
                  ],
                  "suburb",
                  17,
                  16
              ]
          ]
      },
      "paint": {
          "text-halo-color": "hsl(185, 1%, 100%)",
          "text-halo-width": 1,
          "text-color": "hsl(185, 3%, 66%)",
          "text-halo-blur": 0.5
      }
  },
  {
      "id": "settlement-minor-label",
      "type": "symbol",
      "metadata": {
          "mapbox:featureComponent": "place-labels",
          "mapbox:group": "Place labels, place-labels"
      },
      "source": mapboxStreetSourceName,
      "source-layer": "place_label",
      "maxzoom": 15,
      "filter": [
          "all",
          [
              "<=",
              [
                  "get",
                  "filterrank"
              ],
              3
          ],
          [
              "==",
              [
                  "get",
                  "class"
              ],
              "settlement"
          ],
          [
              "step",
              [
                  "zoom"
              ],
              true,
              8,
              [
                  ">=",
                  [
                      "get",
                      "symbolrank"
                  ],
                  11
              ],
              10,
              [
                  ">=",
                  [
                      "get",
                      "symbolrank"
                  ],
                  12
              ],
              11,
              [
                  ">=",
                  [
                      "get",
                      "symbolrank"
                  ],
                  13
              ],
              12,
              [
                  ">=",
                  [
                      "get",
                      "symbolrank"
                  ],
                  15
              ],
              13,
              [
                  ">=",
                  [
                      "get",
                      "symbolrank"
                  ],
                  11
              ],
              14,
              [
                  ">=",
                  [
                      "get",
                      "symbolrank"
                  ],
                  13
              ]
          ]
      ],
      "layout": {
          "text-line-height": 1.1,
          "text-size": [
              "interpolate",
              [
                  "cubic-bezier",
                  0.2,
                  0,
                  0.9,
                  1
              ],
              [
                  "zoom"
              ],
              3,
              [
                  "step",
                  [
                      "get",
                      "symbolrank"
                  ],
                  12,
                  9,
                  11,
                  10,
                  10.5,
                  12,
                  9.5,
                  14,
                  8.5,
                  16,
                  6.5,
                  17,
                  4
              ],
              13,
              [
                  "step",
                  [
                      "get",
                      "symbolrank"
                  ],
                  25,
                  9,
                  23,
                  10,
                  21,
                  11,
                  19,
                  12,
                  18,
                  13,
                  17,
                  15,
                  15
              ]
          ],
          "icon-image": [
              "step",
              [
                  "zoom"
              ],
              [
                  "case",
                  [
                      "==",
                      [
                          "get",
                          "capital"
                      ],
                      2
                  ],
                  "border-dot-13",
                  [
                      "step",
                      [
                          "get",
                          "symbolrank"
                      ],
                      "dot-11",
                      9,
                      "dot-10",
                      11,
                      "dot-9"
                  ]
              ],
              8,
              ""
          ],
          "text-font": [
              "DIN Pro Regular",
              "Arial Unicode MS Regular"
          ],
          "text-justify": [
              "step",
              [
                  "zoom"
              ],
              [
                  "match",
                  [
                      "get",
                      "text_anchor"
                  ],
                  [
                      "left",
                      "bottom-left",
                      "top-left"
                  ],
                  "left",
                  [
                      "right",
                      "bottom-right",
                      "top-right"
                  ],
                  "right",
                  "center"
              ],
              8,
              "center"
          ],
          "text-offset": [
              "step",
              [
                  "zoom"
              ],
              [
                  "match",
                  [
                      "get",
                      "capital"
                  ],
                  2,
                  [
                      "match",
                      [
                          "get",
                          "text_anchor"
                      ],
                      "bottom",
                      [
                          "literal",
                          [
                              0,
                              -0.3
                          ]
                      ],
                      "bottom-left",
                      [
                          "literal",
                          [
                              0.3,
                              -0.1
                          ]
                      ],
                      "left",
                      [
                          "literal",
                          [
                              0.45,
                              0.1
                          ]
                      ],
                      "top-left",
                      [
                          "literal",
                          [
                              0.3,
                              0.1
                          ]
                      ],
                      "top",
                      [
                          "literal",
                          [
                              0,
                              0.3
                          ]
                      ],
                      "top-right",
                      [
                          "literal",
                          [
                              -0.3,
                              0.1
                          ]
                      ],
                      "right",
                      [
                          "literal",
                          [
                              -0.45,
                              0
                          ]
                      ],
                      "bottom-right",
                      [
                          "literal",
                          [
                              -0.3,
                              -0.1
                          ]
                      ],
                      [
                          "literal",
                          [
                              0,
                              -0.3
                          ]
                      ]
                  ],
                  [
                      "match",
                      [
                          "get",
                          "text_anchor"
                      ],
                      "bottom",
                      [
                          "literal",
                          [
                              0,
                              -0.25
                          ]
                      ],
                      "bottom-left",
                      [
                          "literal",
                          [
                              0.2,
                              -0.05
                          ]
                      ],
                      "left",
                      [
                          "literal",
                          [
                              0.4,
                              0.05
                          ]
                      ],
                      "top-left",
                      [
                          "literal",
                          [
                              0.2,
                              0.05
                          ]
                      ],
                      "top",
                      [
                          "literal",
                          [
                              0,
                              0.25
                          ]
                      ],
                      "top-right",
                      [
                          "literal",
                          [
                              -0.2,
                              0.05
                          ]
                      ],
                      "right",
                      [
                          "literal",
                          [
                              -0.4,
                              0.05
                          ]
                      ],
                      "bottom-right",
                      [
                          "literal",
                          [
                              -0.2,
                              -0.05
                          ]
                      ],
                      [
                          "literal",
                          [
                              0,
                              -0.25
                          ]
                      ]
                  ]
              ],
              8,
              [
                  "literal",
                  [
                      0,
                      0
                  ]
              ]
          ],
          "text-anchor": [
              "step",
              [
                  "zoom"
              ],
              [
                  "get",
                  "text_anchor"
              ],
              8,
              "center"
          ],
          "text-field": [
              "coalesce",
              [
                  "get",
                  "name_en"
              ],
              [
                  "get",
                  "name"
              ]
          ],
          "text-max-width": 7
      },
      "paint": {
          "text-color": [
              "step",
              [
                  "get",
                  "symbolrank"
              ],
              "hsl(185, 3%, 47%)",
              11,
              "hsl(185, 3%, 59%)",
              16,
              "hsl(185, 3%, 68%)"
          ],
          "text-halo-color": "hsl(185, 1%, 100%)",
          "text-halo-width": 1,
          "text-halo-blur": 1
      }
  },
  {
      "id": "settlement-major-label",
      "type": "symbol",
      "metadata": {
          "mapbox:featureComponent": "place-labels",
          "mapbox:group": "Place labels, place-labels"
      },
      "source": mapboxStreetSourceName,
      "source-layer": "place_label",
      "maxzoom": 15,
      "filter": [
          "all",
          [
              "<=",
              [
                  "get",
                  "filterrank"
              ],
              3
          ],
          [
              "==",
              [
                  "get",
                  "class"
              ],
              "settlement"
          ],
          [
              "step",
              [
                  "zoom"
              ],
              false,
              8,
              [
                  "<",
                  [
                      "get",
                      "symbolrank"
                  ],
                  11
              ],
              10,
              [
                  "<",
                  [
                      "get",
                      "symbolrank"
                  ],
                  12
              ],
              11,
              [
                  "<",
                  [
                      "get",
                      "symbolrank"
                  ],
                  13
              ],
              12,
              [
                  "<",
                  [
                      "get",
                      "symbolrank"
                  ],
                  15
              ],
              13,
              [
                  ">=",
                  [
                      "get",
                      "symbolrank"
                  ],
                  11
              ],
              14,
              [
                  ">=",
                  [
                      "get",
                      "symbolrank"
                  ],
                  13
              ]
          ]
      ],
      "layout": {
          "text-line-height": 1.1,
          "text-size": [
              "interpolate",
              [
                  "cubic-bezier",
                  0.2,
                  0,
                  0.9,
                  1
              ],
              [
                  "zoom"
              ],
              8,
              [
                  "step",
                  [
                      "get",
                      "symbolrank"
                  ],
                  18,
                  9,
                  17,
                  10,
                  15
              ],
              15,
              [
                  "step",
                  [
                      "get",
                      "symbolrank"
                  ],
                  28,
                  9,
                  26,
                  10,
                  23,
                  11,
                  21,
                  12,
                  20,
                  13,
                  19,
                  15,
                  16
              ]
          ],
          "icon-image": [
              "step",
              [
                  "zoom"
              ],
              [
                  "case",
                  [
                      "==",
                      [
                          "get",
                          "capital"
                      ],
                      2
                  ],
                  "border-dot-13",
                  [
                      "step",
                      [
                          "get",
                          "symbolrank"
                      ],
                      "dot-11",
                      9,
                      "dot-10",
                      11,
                      "dot-9"
                  ]
              ],
              8,
              ""
          ],
          "text-font": [
              "DIN Pro Medium",
              "Arial Unicode MS Regular"
          ],
          "text-justify": [
              "step",
              [
                  "zoom"
              ],
              [
                  "match",
                  [
                      "get",
                      "text_anchor"
                  ],
                  [
                      "left",
                      "bottom-left",
                      "top-left"
                  ],
                  "left",
                  [
                      "right",
                      "bottom-right",
                      "top-right"
                  ],
                  "right",
                  "center"
              ],
              8,
              "center"
          ],
          "text-offset": [
              "step",
              [
                  "zoom"
              ],
              [
                  "match",
                  [
                      "get",
                      "capital"
                  ],
                  2,
                  [
                      "match",
                      [
                          "get",
                          "text_anchor"
                      ],
                      "bottom",
                      [
                          "literal",
                          [
                              0,
                              -0.3
                          ]
                      ],
                      "bottom-left",
                      [
                          "literal",
                          [
                              0.3,
                              -0.1
                          ]
                      ],
                      "left",
                      [
                          "literal",
                          [
                              0.45,
                              0.1
                          ]
                      ],
                      "top-left",
                      [
                          "literal",
                          [
                              0.3,
                              0.1
                          ]
                      ],
                      "top",
                      [
                          "literal",
                          [
                              0,
                              0.3
                          ]
                      ],
                      "top-right",
                      [
                          "literal",
                          [
                              -0.3,
                              0.1
                          ]
                      ],
                      "right",
                      [
                          "literal",
                          [
                              -0.45,
                              0
                          ]
                      ],
                      "bottom-right",
                      [
                          "literal",
                          [
                              -0.3,
                              -0.1
                          ]
                      ],
                      [
                          "literal",
                          [
                              0,
                              -0.3
                          ]
                      ]
                  ],
                  [
                      "match",
                      [
                          "get",
                          "text_anchor"
                      ],
                      "bottom",
                      [
                          "literal",
                          [
                              0,
                              -0.25
                          ]
                      ],
                      "bottom-left",
                      [
                          "literal",
                          [
                              0.2,
                              -0.05
                          ]
                      ],
                      "left",
                      [
                          "literal",
                          [
                              0.4,
                              0.05
                          ]
                      ],
                      "top-left",
                      [
                          "literal",
                          [
                              0.2,
                              0.05
                          ]
                      ],
                      "top",
                      [
                          "literal",
                          [
                              0,
                              0.25
                          ]
                      ],
                      "top-right",
                      [
                          "literal",
                          [
                              -0.2,
                              0.05
                          ]
                      ],
                      "right",
                      [
                          "literal",
                          [
                              -0.4,
                              0.05
                          ]
                      ],
                      "bottom-right",
                      [
                          "literal",
                          [
                              -0.2,
                              -0.05
                          ]
                      ],
                      [
                          "literal",
                          [
                              0,
                              -0.25
                          ]
                      ]
                  ]
              ],
              8,
              [
                  "literal",
                  [
                      0,
                      0
                  ]
              ]
          ],
          "text-anchor": [
              "step",
              [
                  "zoom"
              ],
              [
                  "get",
                  "text_anchor"
              ],
              8,
              "center"
          ],
          "text-field": [
              "coalesce",
              [
                  "get",
                  "name_en"
              ],
              [
                  "get",
                  "name"
              ]
          ],
          "text-max-width": 7
      },
      "paint": {
          "text-color": [
              "step",
              [
                  "get",
                  "symbolrank"
              ],
              "hsl(185, 3%, 47%)",
              11,
              "hsl(185, 3%, 59%)",
              16,
              "hsl(185, 3%, 68%)"
          ],
          "text-halo-color": "hsl(185, 1%, 100%)",
          "text-halo-width": 1,
          "text-halo-blur": 1
      }
  },
  {
      "id": "state-label",
      "type": "symbol",
      "metadata": {
          "mapbox:featureComponent": "place-labels",
          "mapbox:group": "Place labels, place-labels"
      },
      "source": mapboxStreetSourceName,
      "source-layer": "place_label",
      "minzoom": 3,
      "maxzoom": 9,
      "filter": [
          "==",
          [
              "get",
              "class"
          ],
          "state"
      ],
      "layout": {
          "text-size": [
              "interpolate",
              [
                  "cubic-bezier",
                  0.85,
                  0.7,
                  0.65,
                  1
              ],
              [
                  "zoom"
              ],
              4,
              [
                  "step",
                  [
                      "get",
                      "symbolrank"
                  ],
                  10,
                  6,
                  9.5,
                  7,
                  9
              ],
              9,
              [
                  "step",
                  [
                      "get",
                      "symbolrank"
                  ],
                  24,
                  6,
                  18,
                  7,
                  14
              ]
          ],
          "text-transform": "uppercase",
          "text-font": [
              "DIN Pro Bold",
              "Arial Unicode MS Bold"
          ],
          "text-field": [
              "step",
              [
                  "zoom"
              ],
              [
                  "step",
                  [
                      "get",
                      "symbolrank"
                  ],
                  [
                      "coalesce",
                      [
                          "get",
                          "name_en"
                      ],
                      [
                          "get",
                          "name"
                      ]
                  ],
                  5,
                  [
                      "coalesce",
                      [
                          "get",
                          "abbr"
                      ],
                      [
                          "get",
                          "name_en"
                      ],
                      [
                          "get",
                          "name"
                      ]
                  ]
              ],
              5,
              [
                  "coalesce",
                  [
                      "get",
                      "name_en"
                  ],
                  [
                      "get",
                      "name"
                  ]
              ]
          ],
          "text-letter-spacing": 0.15,
          "text-max-width": 6
      },
      "paint": {
          "text-color": "hsl(185, 3%, 68%)",
          "text-halo-color": "hsl(185, 1%, 100%)",
          "text-halo-width": 1
      }
  },
  {
      "id": "country-label",
      "type": "symbol",
      "metadata": {
          "mapbox:featureComponent": "place-labels",
          "mapbox:group": "Place labels, place-labels"
      },
      "source": mapboxStreetSourceName,
      "source-layer": "place_label",
      "minzoom": 1,
      "maxzoom": 10,
      "filter": [
          "==",
          [
              "get",
              "class"
          ],
          "country"
      ],
      "layout": {
          "icon-image": "",
          "text-field": [
              "coalesce",
              [
                  "get",
                  "name_en"
              ],
              [
                  "get",
                  "name"
              ]
          ],
          "text-line-height": 1.1,
          "text-max-width": 6,
          "text-font": [
              "DIN Pro Medium",
              "Arial Unicode MS Regular"
          ],
          "text-offset": [
              "literal",
              [
                  0,
                  0
              ]
          ],
          "text-justify": [
              "step",
              [
                  "zoom"
              ],
              [
                  "match",
                  [
                      "get",
                      "text_anchor"
                  ],
                  [
                      "left",
                      "bottom-left",
                      "top-left"
                  ],
                  "left",
                  [
                      "right",
                      "bottom-right",
                      "top-right"
                  ],
                  "right",
                  "center"
              ],
              7,
              "center"
          ],
          "text-size": [
              "interpolate",
              [
                  "cubic-bezier",
                  0.2,
                  0,
                  0.7,
                  1
              ],
              [
                  "zoom"
              ],
              1,
              [
                  "step",
                  [
                      "get",
                      "symbolrank"
                  ],
                  11,
                  4,
                  9,
                  5,
                  8
              ],
              9,
              [
                  "step",
                  [
                      "get",
                      "symbolrank"
                  ],
                  28,
                  4,
                  22,
                  5,
                  21
              ]
          ]
      },
      "paint": {
          "icon-opacity": [
              "step",
              [
                  "zoom"
              ],
              [
                  "case",
                  [
                      "has",
                      "text_anchor"
                  ],
                  1,
                  0
              ],
              7,
              0
          ],
          "text-color": "hsl(185, 3%, 47%)",
          "text-halo-color": "hsl(185, 1%, 100%)",
          "text-halo-width": 1.25
      }
  }
])
