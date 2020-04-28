import React, { useRef, useCallback, useEffect, Dispatch } from "react";
import usePrevious from "../usePrevious";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { SET_SELECTED_INSTITUTION_ACTION } from "./Map";
import { Action as PartnersAction, State as PartnersState } from "./Partners";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { makeStyles } from "@material-ui/core";
import { submittedDataMarkerColor } from "./MapMarker";

const useMaterialStyles = makeStyles(() => ({
  iconRoot: {
    color: submittedDataMarkerColor,
  },
}));

// This list item will scroll itself into view when it becomes selelected for
// the first time if it's out of view.
interface Props<K extends keyof PartnersState> {
  study: string;
  id: string;
  selectedId: string | undefined;
  dispatch: Dispatch<PartnersAction<K>>;
  hasSubmittedData: boolean;
}

const SmartListItem = <K extends keyof PartnersState>(props: Props<K>) => {
  const { id, selectedId, dispatch, study, hasSubmittedData } = props;
  const prevSelectedId = usePrevious(selectedId);
  const elRef = useRef<HTMLElement | null>(null);
  const rememberEl = useCallback((el) => (elRef.current = el), []);
  const isSelected = selectedId !== undefined && selectedId === id;
  const materialStyles = useMaterialStyles();

  useEffect(() => {
    if (selectedId === id && selectedId !== prevSelectedId) {
      const { current: el } = elRef;
      if (el !== null) {
        // Taken from https://stackoverflow.com/a/52835382/7075699
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
        return undefined;
      }
    }
  }, [isSelected, id, prevSelectedId, selectedId]);
  const onClick = () =>
    dispatch({
      type: SET_SELECTED_INSTITUTION_ACTION,
      payload: { id },
    });
  const icon = hasSubmittedData ? (
    <FiberManualRecordIcon
      classes={{
        root: materialStyles.iconRoot,
      }}
    />
  ) : (
    <div />
  );
  return (
    <ListItem
      button={true}
      selected={isSelected}
      onClick={onClick}
      ref={rememberEl}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{study}</ListItemText>
    </ListItem>
  );
};

export default SmartListItem;
