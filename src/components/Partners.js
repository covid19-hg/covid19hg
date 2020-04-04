import React, { useReducer, useState } from "react";
import PropTypes from "prop-types";
import Map, {
  SET_SELECTED_INSTITUTION_ACTION,
  UNSET_SELECTED_INSTITUTION_ACTION,
} from "../components/Map";
import InstitutionsList from "../components/InstitutionsList";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
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
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const useMaterialStyles = makeStyles(() => ({
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
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

const Partners = ({ title, mapData }) => {
  const retrospectiveStateName = "isRetrospectiveSelected";
  const prospectiveStateName = "isProspectiveSelected";
  const wesStateName = "isWesSelected";
  const wgsStateName = "isWgsSelected";
  const gwasStateName = "isGwasSelected";
  const assaysStateName = "assays";
  const researchCategoriesStateName = "researchCategories";

  const [state, dispatch] = useReducer(reducer, {
    selectedId: undefined,
    [retrospectiveStateName]: false,
    [prospectiveStateName]: false,
    [wesStateName]: false,
    [wgsStateName]: false,
    [gwasStateName]: false,
    [assaysStateName]: [],
    [researchCategoriesStateName]: [],
  });

  const materialStyles = useMaterialStyles();

  const listItems = mapData.map(({ id, study }) => {
    const selected = state.selectedId !== undefined && state.selectedId === id;
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

  const list = <List> {listItems} </List>;

  const assayOptions = ["Viral sequencing", "Transcriptomics"];
  const researchCategoryOptions = ["Pediatrics"];

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
      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-one-quarter">
                <FormLabel> Study Type</FormLabel>
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
                </FormGroup>
                <FormGroup row={true}>
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
              </div>
              <div className="column is-one-quarter">
                <FormLabel>Genetic Analysis</FormLabel>
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
                </FormGroup>
                <FormGroup row={true}>
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
                </FormGroup>
                <FormGroup row={true}>
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
              </div>
              <div className="column is-one-quarter">
                <FormLabel>Genetic Analysis</FormLabel>
                <FormGroup>
                  <Select
                    id="partners-assays-planned"
                    multiple={true}
                    value={state[assaysStateName]}
                    onChange={(event) =>
                      dispatch({
                        type: SET_FORM_STATE,
                        payload: {
                          name: assaysStateName,
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
                    {assayOptions.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormGroup>
              </div>

              <div className="column is-one-quarter">
                <FormLabel>Research Categories</FormLabel>
                <FormGroup>
                  <Select
                    multiple={true}
                    value={state[researchCategoriesStateName]}
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
                    {researchCategoryOptions.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormGroup>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="columns">
              <div
                className={`column is-one-quarter`}
                style={{ maxHeight: "50vh", overflowY: "auto" }}
              >
                {list}
              </div>
              <div className="column is-three-quarters">
                <Map dispatchMessageToParent={dispatch} mapData={mapData} />
              </div>
            </div>
          </div>
        </div>
        <center>
          <p>
            <strong>Website team: </strong> Matthew Solomonson, Huy Nguyen
          </p>
        </center>
      </section>
    </div>
  );
};

Partners.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
};

export default Partners;
