import React, { useReducer, useCallback } from "react";
import Map from "../components/Map";
import Card, { assayOptions } from "./NewCard";
import CountrySelect from "./CountrySelect";
import _debounce from "lodash/debounce";
import _flatten from "lodash/flatten";
import _uniq from "lodash/uniq";
import InvestigatorContactForm from "./InvestigatorContactForm";
import "typeface-roboto";
import { MapDatum, ListDatum } from "../types";
import { Container, Grid } from "./materialUIContainers";
import Typography from "@material-ui/core/Typography";
import StudyList from "./StudyList";
import { gridSpacing } from "./partnersPageStylingParams";
import CheckboxGroup, { CheckboxInfo } from "./CheckboxGroup";
import MultiSelect from "./MultiSelect";
import TextSearch from "./TextSearch";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import {
  partnersStudyTypeFilter,
  partnersGeneticAnalysisFilter,
  partnersAssaysPlannedOption,
  partnersAssaysPlannedSelector,
  partnersResearchCategoriesOption,
  partnersResearchCategoriesSelector,
} from "../cypressTestDataAttrs";

const assayNames = assayOptions.map(({ name }) => name);

const FilterControlContainer = (props: { children: React.ReactNode }) => (
  <Grid item={true} md={4} sm={6} xs={12}>
    {props.children}
  </Grid>
);

export const SET_FORM_STATE = "SET_FORM_STATE";

const retrospectiveStateName = "isRetrospectiveSelected";
const prospectiveStateName = "isProspectiveSelected";
const wesStateName = "isWesSelected";
const wgsStateName = "isWgsSelected";
const gwasStateName = "isGwasSelected";
const assaysStateName = "assays";
const researchCategoriesStateName = "researchCategories";
const selectedCountryStateName = "selectedCountry";
const keywordSearchStateName = "keywordSearch";
export const contactFormOpenStateName = "isContactFormOpen";

export interface State {
  [retrospectiveStateName]: boolean;
  [prospectiveStateName]: boolean;
  [wesStateName]: boolean;
  [wgsStateName]: boolean;
  [gwasStateName]: boolean;
  [assaysStateName]: string[];
  [researchCategoriesStateName]: string[];
  [selectedCountryStateName]: string | undefined;
  [keywordSearchStateName]: string;
  [contactFormOpenStateName]: boolean;
}
const initialState: State = {
  [retrospectiveStateName]: false,
  [prospectiveStateName]: false,
  [wesStateName]: false,
  [wgsStateName]: false,
  [gwasStateName]: false,
  [assaysStateName]: [],
  [researchCategoriesStateName]: [],
  [selectedCountryStateName]: undefined,
  [keywordSearchStateName]: "",
  [contactFormOpenStateName]: false,
};

interface SetStateAction<K extends keyof State> {
  type: typeof SET_FORM_STATE;
  payload: {
    name: K;
    value: State[K];
  };
}

export type Action<K extends keyof State> = SetStateAction<K>;

const reducer = <K extends keyof State>(
  state: State,
  action: Action<K>
): State => {
  switch (action.type) {
    case SET_FORM_STATE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
};

interface Props {
  mapData: MapDatum[] | undefined;
  listData: ListDatum[] | undefined;
  selectedPartner: string | undefined;
  setSelectedPartner: (selected: string | undefined) => void;
}

const Partners = ({
  mapData,
  listData,
  selectedPartner,
  setSelectedPartner,
}: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  let filteredIds: string[];
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
    const selectedCountry = state[selectedCountryStateName];
    if (selectedCountry !== undefined) {
      filteredData = filteredData.filter(({ country }) => {
        const thisCountryString = country.toLowerCase().replace(/\s+/g, "");
        const selectedCountryString = selectedCountry
          .toLowerCase()
          .replace(/\s+/g, "");
        return (
          thisCountryString.includes(selectedCountryString) ||
          selectedCountryString.includes(thisCountryString)
        );
      });
    }
    if (state[keywordSearchStateName] !== "") {
      filteredData = filteredData.filter((elem) =>
        elem.allText.includes(state[keywordSearchStateName])
      );
    }

    filteredIds = filteredData.map(({ id }) => id);
  }

  const showContactForm = useCallback(() => {
    const action: SetStateAction<typeof contactFormOpenStateName> = {
      type: SET_FORM_STATE,
      payload: {
        name: contactFormOpenStateName,
        value: true,
      },
    };
    dispatch(action);
  }, []);

  const studyTypeCheckboxes: CheckboxInfo[] = [
    {
      label: "Retrospective",
      isChecked: state[retrospectiveStateName],
      onChange: (value: boolean) => {
        const action: SetStateAction<typeof retrospectiveStateName> = {
          type: SET_FORM_STATE,
          payload: { name: retrospectiveStateName, value },
        };
        dispatch(action);
      },
    },
    {
      label: "Prospective",
      isChecked: state[prospectiveStateName],
      onChange: (value: boolean) => {
        const action: SetStateAction<typeof prospectiveStateName> = {
          type: SET_FORM_STATE,
          payload: { name: prospectiveStateName, value },
        };
        dispatch(action);
      },
    },
  ];
  const studyTypeElem = (
    <CheckboxGroup
      label="Study Type"
      checkboxes={studyTypeCheckboxes}
      dataCyAttr={partnersStudyTypeFilter}
    />
  );

  const assaysPlannedElem = (
    <MultiSelect
      value={state[assaysStateName]}
      onChange={(value: string[]) => {
        const action: SetStateAction<typeof assaysStateName> = {
          type: SET_FORM_STATE,
          payload: { name: assaysStateName, value },
        };
        dispatch(action);
      }}
      options={assayNames}
      label="Assays Planned"
      mainDataCyAttr={partnersAssaysPlannedSelector}
      optionDataCyAttr={partnersAssaysPlannedOption}
    />
  );

  const geneticAnalysisCheckboxes = [
    {
      label: "GWAS",
      isChecked: state[gwasStateName],
      onChange: (value: boolean) => {
        const action: SetStateAction<typeof gwasStateName> = {
          type: SET_FORM_STATE,
          payload: { name: gwasStateName, value },
        };
        dispatch(action);
      },
    },
    {
      label: "WES",
      isChecked: state[wesStateName],
      onChange: (value: boolean) => {
        const action: SetStateAction<typeof wesStateName> = {
          type: SET_FORM_STATE,
          payload: { name: wesStateName, value },
        };
        dispatch(action);
      },
    },
    {
      label: "WGS",
      isChecked: state[wgsStateName],
      onChange: (value: boolean) => {
        const action: SetStateAction<typeof wgsStateName> = {
          type: SET_FORM_STATE,
          payload: { name: wgsStateName, value },
        };
        dispatch(action);
      },
    },
  ];

  const geneticAnalysisElem = (
    <CheckboxGroup
      label="Genetic Analysis"
      checkboxes={geneticAnalysisCheckboxes}
      dataCyAttr={partnersGeneticAnalysisFilter}
    />
  );

  let researchCategoriesElem: React.ReactElement<any> | null;
  if (listData === undefined) {
    researchCategoriesElem = null;
  } else {
    const researchCategoryNames = _uniq(
      _flatten(listData.map(({ researchCategory }) => researchCategory)).filter(
        (elem) => !!elem
      )
    );
    researchCategoriesElem = (
      <MultiSelect
        value={state[researchCategoriesStateName]}
        onChange={(value: string[]) => {
          const action: SetStateAction<typeof researchCategoriesStateName> = {
            type: SET_FORM_STATE,
            payload: { name: researchCategoriesStateName, value },
          };
          dispatch(action);
        }}
        options={researchCategoryNames}
        label="Research Categories"
        mainDataCyAttr={partnersResearchCategoriesSelector}
        optionDataCyAttr={partnersResearchCategoriesOption}
      />
    );
  }

  const onKeywordSearchChange = useCallback(
    _debounce((value: string) => {
      const action: SetStateAction<typeof keywordSearchStateName> = {
        type: SET_FORM_STATE,
        payload: {
          name: keywordSearchStateName,
          value: value.toLowerCase(),
        },
      };
      dispatch(action);
    }, 250),
    []
  );

  const keywordSearchElem = (
    <TextSearch label="Keyword" onChange={onKeywordSearchChange} />
  );

  const studyListSetSelected = useCallback(
    (id: string) => setSelectedPartner(id),
    []
  );

  const listElem = (
    <StudyList
      listData={listData}
      filteredIds={filteredIds}
      selectedId={selectedPartner}
      setSelectedStudy={studyListSetSelected}
    />
  );

  let card: React.ReactElement<any> | null;
  if (listData === undefined) {
    card = null;
  } else {
    const filteredData = listData.filter(({ id }) => filteredIds.includes(id));
    if (
      selectedPartner === undefined ||
      filteredData.map(({ id }) => id).includes(selectedPartner) === false
    ) {
      // Do not show card if there's no selected study or if  the selected study has been filtered out:
      card = (
        <>
          <Typography variant="h5" component="h2">
            Please select a study
          </Typography>
        </>
      );
    } else {
      const cardInfo = listData.find(({ id }) => id === selectedPartner)!;
      card = (
        <>
          <Card cardInfo={cardInfo} showContactForm={showContactForm} />
        </>
      );
    }
  }

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  let mapElem: React.ReactElement<any> | null;
  if (isDesktop === false) {
    mapElem = null;
  } else if (mapData === undefined) {
    mapElem = <Map hasData={false} />;
  } else {
    const filteredData = mapData.filter(({ id }) => filteredIds.includes(id));
    mapElem = (
      <Map
        hasData={true}
        setSelected={setSelectedPartner}
        mapData={mapData}
        filteredData={filteredData}
        selected={selectedPartner}
      />
    );
  }

  return (
    <Container marginTop={1}>
      <Typography variant="h5" component="h2">
        Find studies
      </Typography>
      <Grid container={true} spacing={gridSpacing} marginTop={1}>
        <FilterControlContainer> {studyTypeElem} </FilterControlContainer>
        <FilterControlContainer> {assaysPlannedElem} </FilterControlContainer>
        <FilterControlContainer>
          <CountrySelect
            onChange={(_event, value: string) => {
              const dispatchedValue = value === "" ? undefined : value;
              const action: SetStateAction<typeof selectedCountryStateName> = {
                type: SET_FORM_STATE,
                payload: {
                  name: selectedCountryStateName,
                  value: dispatchedValue,
                },
              };
              dispatch(action);
            }}
          />
        </FilterControlContainer>

        <FilterControlContainer> {geneticAnalysisElem} </FilterControlContainer>
        <FilterControlContainer>
          {researchCategoriesElem}
        </FilterControlContainer>
        <FilterControlContainer> {keywordSearchElem} </FilterControlContainer>
      </Grid>

      <Grid container={true} spacing={gridSpacing} marginTop={2}>
        {listElem}
        {mapElem}
      </Grid>

      <Container marginTop={4} disableGutters={true}>
        {card}
      </Container>
      <InvestigatorContactForm
        selectedId={selectedPartner}
        isOpen={state[contactFormOpenStateName]}
        dispatchMessageToParent={dispatch}
      />
    </Container>
  );
};

export default Partners;
