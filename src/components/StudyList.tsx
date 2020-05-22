import React from "react";
import { ListDatum } from "../types";
import { makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { Grid } from "./materialUIContainers";
import List from "@material-ui/core/List";
import SmartListItem from "./SmartListItem";
import {
  listAndMapHeight,
  ListMapTitleGridItem,
} from "./partnersPageStylingParams";

const useMaterialStyles = makeStyles(() => ({
  listRoot: {
    overflowY: "scroll",
    height: "100%",
    paddingBottom: 0,
  },
}));
const listTitleFlexOrder = 1;
const listFlexOrder = 3;

interface Props {
  listData: ListDatum[] | undefined;
  filteredIds: string[];
  selectedId: string | undefined;
  setSelectedStudy: (id: string) => void;
}

const StudyList = ({
  listData,
  filteredIds,
  selectedId,
  setSelectedStudy,
}: Props) => {
  const classes = useMaterialStyles();
  const columnWidthMd = 4;
  if (listData === undefined) {
    return (
      <>
        <ListMapTitleGridItem md={columnWidthMd} order={listTitleFlexOrder} />
        <Grid
          item={true}
          md={columnWidthMd}
          order={listFlexOrder}
          display="flex"
          justifyContent="center"
          alignItems={"center" as "center"}
          height={listAndMapHeight}
        >
          <CircularProgress />
        </Grid>
      </>
    );
  } else {
    const filteredData = listData.filter(({ id }) => filteredIds.includes(id));

    const studyListHeadingText =
      listData.length === filteredData.length
        ? `Registered studies (${listData.length})`
        : `Matching studies (${filteredData.length})`;

    const listItems = filteredData.map(({ id, study, hasSubmittedData }) => (
      <SmartListItem
        key={id}
        id={id}
        study={study}
        selectedId={selectedId}
        setSelectedId={setSelectedStudy}
        hasSubmittedData={hasSubmittedData}
      />
    ));
    return (
      <>
        <ListMapTitleGridItem
          md={columnWidthMd}
          order={listTitleFlexOrder}
          display="flex"
          alignItems={"center" as "center"}
        >
          <Typography variant="h5">{studyListHeadingText}</Typography>
        </ListMapTitleGridItem>
        <Grid
          item={true}
          md={columnWidthMd}
          order={listFlexOrder}
          height={listAndMapHeight}
        >
          <List dense={true} className={classes.listRoot}>
            {listItems}
          </List>
        </Grid>
      </>
    );
  }
};

export default StudyList;
