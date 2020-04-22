import React, { useRef, useCallback, useEffect, Dispatch } from "react";
import usePrevious from "../usePrevious";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { SET_SELECTED_INSTITUTION_ACTION } from "./Map";
import { Action as PartnersAction, State as PartnersState } from "./Partners";

// This list item will scroll itself into view when it becomes selelected for
// the first time if it's out of view.
interface Props<K extends keyof PartnersState> {
  study: string;
  id: string;
  selectedId: string | undefined;
  dispatch: Dispatch<PartnersAction<K>>;
}

const SmartListItem = <K extends keyof PartnersState>(props: Props<K>) => {
  const { id, selectedId, dispatch, study } = props;
  const prevSelectedId = usePrevious(selectedId);
  const elRef = useRef<HTMLElement | null>(null);
  const rememberEl = useCallback((el) => (elRef.current = el), []);
  const isSelected = selectedId !== undefined && selectedId === id;

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
  return (
    <ListItem
      button={true}
      selected={isSelected}
      onClick={onClick}
      ref={rememberEl}
    >
      <ListItemText>{study}</ListItemText>
    </ListItem>
  );
};

export default SmartListItem;
