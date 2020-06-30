import React, { useRef, useCallback, useEffect } from "react";
import usePrevious from "../usePrevious";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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
interface Props {
  study: string;
  id: string;
  selectedId: string | undefined;
  setSelectedId: (string: string) => void;
  hasSubmittedData: boolean;
}

const SmartListItem = (props: Props) => {
  const { id, selectedId, setSelectedId, study, hasSubmittedData } = props;
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
          // behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
        return undefined;
      }
    }
  }, [isSelected, id, prevSelectedId, selectedId]);
  const onClick = () => setSelectedId(id);
  const icon = hasSubmittedData ? (
    <FiberManualRecordIcon className={materialStyles.iconRoot} />
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
