import React, { useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import Map, {
  SET_SELECTED_INSTITUTION_ACTION,
  UNSET_SELECTED_INSTITUTION_ACTION,
} from "../components/Map";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Card, { assayOptions } from "./Card";
import CountrySelect from "./CountrySelect";
import TextField from "@material-ui/core/TextField";
import _debounce from "lodash/debounce";
import _flatten from "lodash/flatten";
import _uniq from "lodash/uniq";
import CircularProgress from "@material-ui/core/CircularProgress";
import "typeface-roboto";

const assayNames = assayOptions.map(({ name }) => name);
const studyListStyleName = "studyList";

const useMaterialStyles = makeStyles(() => ({
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  dropdownFormControl: {
    padding: "0 0.625rem",
    borderWidth: "1px",
    borderStyle: "solid",
    display: "block",
    minHeight: "65px",
  },
  dropdownSelect: {
    "&&:focus": {
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
  },
  checkboxFormControl: {
    padding: "0.2rem 0.625rem",
    borderWidth: "1px",
    borderStyle: "solid",
    display: "block",
  },
  countrySelector: {
    padding: "0 0.625rem",
    display: "block",
    marginTop: "1rem",
  },
  keywordSearch: {
    display: "block",
    marginTop: "0.5rem",
  },
  [studyListStyleName]: {
    marginTop: 0,
    marginLeft: 0,
  },
  keywordSearchOutline: {
    borderColor: "rgb(51, 51, 51)",
    borderRadius: 0,
  },
}));

const SET_FORM_STATE = "SET_FORM_STATE";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_SELECTED_INSTITUTION_ACTION:
      return {
        ...state,
        selectedId: action.payload.id,
      };
    case UNSET_SELECTED_INSTITUTION_ACTION:
      return {
        ...state,
        selectedId: undefined,
      };
    case SET_FORM_STATE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const Partners = ({ title, mapData, listData }) => {
  const retrospectiveStateName = "isRetrospectiveSelected";
  const prospectiveStateName = "isProspectiveSelected";
  const wesStateName = "isWesSelected";
  const wgsStateName = "isWgsSelected";
  const gwasStateName = "isGwasSelected";
  const assaysStateName = "assays";
  const researchCategoriesStateName = "researchCategories";
  const selectedCountryStateName = "selectedCountry";
  const keywordSearchStateName = "keywordSearch";

  const [state, dispatch] = useReducer(reducer, {
    selectedId: undefined,
    [retrospectiveStateName]: false,
    [prospectiveStateName]: false,
    [wesStateName]: false,
    [wgsStateName]: false,
    [gwasStateName]: false,
    [assaysStateName]: [],
    [researchCategoriesStateName]: [],
    [selectedCountryStateName]: undefined,
    [keywordSearchStateName]: "",
  });
  const materialStyles = useMaterialStyles();

  let filteredIds;
  if (listData === undefined) {
    filteredIds = [];
  } else {
    let filteredData = listData;
    if (state[retrospectiveStateName] === true) {
      filteredData = filteredData.filter(
        ({ retrospective }) => retrospective === true
      );
    }
    if (state[prospectiveStateName] === true) {
      filteredData = filteredData.filter(
        ({ prospective }) => prospective === true
      );
    }
    if (state[wesStateName] === true) {
      filteredData = filteredData.filter(({ wes }) => wes === true);
    }
    if (state[wgsStateName] === true) {
      filteredData = filteredData.filter(({ wgs }) => wgs === true);
    }
    if (state[gwasStateName] === true) {
      filteredData = filteredData.filter(
        ({ genotyping }) => genotyping === true
      );
    }
    state[assaysStateName].forEach((assayName) => {
      filteredData = filteredData.filter(
        (elem) =>
          "assaysPlanned" in elem && elem.assaysPlanned.includes(assayName)
      );
    });
    state[researchCategoriesStateName].forEach((category) => {
      filteredData = filteredData.filter(
        (elem) =>
          "researchCategory" in elem && elem.researchCategory.includes(category)
      );
    });
    if (state[selectedCountryStateName] !== undefined) {
      filteredData = filteredData.filter(
        ({ country }) => country === state[selectedCountryStateName]
      );
    }
    if (state[keywordSearchStateName] !== "") {
      filteredData = filteredData.filter((elem) =>
        elem.allText.includes(state[keywordSearchStateName])
      );
    }

    filteredIds = filteredData.map(({ id }) => id);
  }

  const studyTypeElem = (
    <FormControl
      component="fieldset"
      classes={{
        root: materialStyles.checkboxFormControl,
      }}
    >
      <FormLabel component="legend"> Study Type</FormLabel>
      <FormGroup row={true}>
        <FormControlLabel
          control={
            <Checkbox
              checked={state[retrospectiveStateName]}
              onChange={(event) =>
                dispatch({
                  type: SET_FORM_STATE,
                  payload: {
                    name: retrospectiveStateName,
                    value: event.target.checked,
                  },
                })
              }
            />
          }
          label="Retrospective"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state[prospectiveStateName]}
              onChange={(event) =>
                dispatch({
                  type: SET_FORM_STATE,
                  payload: {
                    name: prospectiveStateName,
                    value: event.target.checked,
                  },
                })
              }
            />
          }
          label="Prospective"
        />
      </FormGroup>
    </FormControl>
  );

  const assaysPlannedElem = (
    <FormControl
      component="fieldset"
      classes={{
        root: materialStyles.dropdownFormControl,
      }}
    >
      <FormLabel component="legend">Assays planned</FormLabel>
      <FormGroup>
        <Select
          id="partners-assays-planned"
          multiple={true}
          value={state[assaysStateName]}
          classes={{
            select: materialStyles.dropdownSelect,
          }}
          onChange={(event) =>
            dispatch({
              type: SET_FORM_STATE,
              payload: {
                name: assaysStateName,
                value: event.target.value,
              },
            })
          }
          input={<Input disableUnderline={true} />}
          renderValue={(selected) => (
            <div className={materialStyles.chips}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  className={materialStyles.chip}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {assayNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormGroup>
    </FormControl>
  );

  const geneticAnalysisElem = (
    <FormControl
      component="fieldset"
      classes={{
        root: materialStyles.checkboxFormControl,
      }}
    >
      <FormLabel component="legend">Genetic analysis</FormLabel>
      <FormGroup row={true}>
        <FormControlLabel
          control={
            <Checkbox
              checked={state[gwasStateName]}
              onChange={(event) =>
                dispatch({
                  type: SET_FORM_STATE,
                  payload: {
                    name: gwasStateName,
                    value: event.target.checked,
                  },
                })
              }
            />
          }
          label="GWAS"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state[wesStateName]}
              onChange={(event) =>
                dispatch({
                  type: SET_FORM_STATE,
                  payload: {
                    name: wesStateName,
                    value: event.target.checked,
                  },
                })
              }
            />
          }
          label="WES"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={state[wgsStateName]}
              onChange={(event) =>
                dispatch({
                  type: SET_FORM_STATE,
                  payload: {
                    name: wgsStateName,
                    value: event.target.checked,
                  },
                })
              }
            />
          }
          label="WGS"
        />
      </FormGroup>
    </FormControl>
  );

  let researchCategoriesElem;
  if (listData === undefined) {
    researchCategoriesElem = null;
  } else {
    const researchCategoryNames = _uniq(
      _flatten(listData.map(({ researchCategory }) => researchCategory)).filter(
        (elem) => !!elem
      )
    );
    researchCategoriesElem = (
      <FormControl
        component="fieldset"
        classes={{
          root: materialStyles.dropdownFormControl,
        }}
      >
        <FormLabel component="legend">Research Categories</FormLabel>
        <FormGroup>
          <Select
            multiple={true}
            value={state[researchCategoriesStateName]}
            disableUnderline={true}
            classes={{
              select: materialStyles.dropdownSelect,
            }}
            onChange={(event) =>
              dispatch({
                type: SET_FORM_STATE,
                payload: {
                  name: researchCategoriesStateName,
                  value: event.target.value,
                },
              })
            }
            input={<Input />}
            renderValue={(selected) => (
              <div className={materialStyles.chips}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    className={materialStyles.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {researchCategoryNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormGroup>
      </FormControl>
    );
  }

  const onKeywordSearchChange = useCallback(
    _debounce((value) => {
      dispatch({
        type: SET_FORM_STATE,
        payload: {
          name: keywordSearchStateName,
          value: value.toLowerCase(),
        },
      });
    }, 250),
    []
  );

  const keywordSearchElem = (
    <FormControl
      comnponent="fieldset"
      classes={{ root: materialStyles.keywordSearch }}
    >
      <TextField
        id="standard-basic"
        label="Keyword"
        variant="outlined"
        fullWidth={true}
        InputProps={{
          classes: {
            notchedOutline: materialStyles.keywordSearchOutline,
          },
        }}
        onChange={(event) => onKeywordSearchChange(event.target.value)}
      />
    </FormControl>
  );

  let listElem, card;
  if (listData === undefined) {
    listElem = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
    card = null;
  } else {
    const filteredData = listData.filter(({ id }) => filteredIds.includes(id));
    const listItems = filteredData.map(({ id, study }) => {
      const selected =
        state.selectedId !== undefined && state.selectedId === id;
      const onClick = () =>
        dispatch({
          type: SET_SELECTED_INSTITUTION_ACTION,
          payload: { id },
        });
      return (
        <ListItem button selected={selected} key={id} onClick={onClick}>
          <ListItemText>{study}</ListItemText>
        </ListItem>
      );
    });

    const studyListHeadingText =
      listData.length === filteredData.length
        ? `Registered studies (${listData.length})`
        : `Matching studies (${filteredData.length})`;
    listElem = (
      <>
        <div className="title is-4">{studyListHeadingText} </div>
        <div style={{ maxHeight: "36vh", overflowY: "auto" }}>
          <List dense={true} component="div">
            {listItems}
          </List>
        </div>
      </>
    );

    if (
      state.selectedId === undefined ||
      filteredData.map(({ id }) => id).includes(state.selectedId) === false
    ) {
      // Do not show card if there's no selected study or if  the selected study has been filtered out:
      card = (
        <div className="section" style={{ marginTop: 0, paddingTop: 0 }}>
          <div className="card">
            <div className="card-header" style={{ minHeight: "5rem" }}>
              <div className="card-header-title">
                <div className="title is-4"> Please select a study </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      const cardInfo = listData.find(({ id }) => id === state.selectedId);
      card = (
        <div className="section" style={{ marginTop: 0, paddingTop: 0 }}>
          <div className="title is-4">Study details</div>
          <Card cardInfo={cardInfo} />
        </div>
      );
    }
  }

  let mapElem;
  if (mapData === undefined) {
    mapElem = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  } else {
    const filteredData = mapData.filter(({ id }) => filteredIds.includes(id));
    mapElem = (
      <Map
        dispatchMessageToParent={dispatch}
        mapData={mapData}
        filteredData={filteredData}
      />
    );
  }

  return (
    <div className="content">
      <div>
        <h1
          className="has-text-weight-bold is-size-1"
          style={{
            boxShadow: "0.5rem 0 0 #f40, -0.5rem 0 0 #f40",
            backgroundColor: "#142166",
            color: "white",
            padding: "1rem",
          }}
        >
          {title}
        </h1>
      </div>
      <section className="section section--gradient" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section" style={{ paddingTop: 0 }}>
            <div className="title is-4">Find studies</div>
            <div className="columns">
              <div className="column is-one-third">{studyTypeElem}</div>
              <div className="column is-one-third">{assaysPlannedElem}</div>
              <div className="column is-one-third">
                <CountrySelect
                  onChange={(event, value) => {
                    const dispatchedValue = value === "" ? undefined : value;
                    dispatch({
                      type: SET_FORM_STATE,
                      payload: {
                        name: selectedCountryStateName,
                        value: dispatchedValue,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className="columns">
              <div className="column is-one-third">{geneticAnalysisElem}</div>
              <div className="column is-one-third">
                {researchCategoriesElem}
              </div>
              <div className="column is-one-third">{keywordSearchElem}</div>
            </div>
          </div>
          <div className="section">
            <div className="columns">
              <div className="column is-one-third">{listElem}</div>
              <div className="column is-two-thirds">{mapElem}</div>
            </div>
          </div>
          {card}
        </div>
      </section>
    </div>
  );
};

Partners.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
};

export default Partners;
