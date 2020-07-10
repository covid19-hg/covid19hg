import React from "react";
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  makeStyles,
  Checkbox,
  Theme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    borderWidth: 1,
    borderStyle: "solid",
    padding: theme.spacing(0.5, 1),
    display: "block",
  },
}));

export interface CheckboxInfo {
  label: string;
  isChecked: boolean;
  onChange: (value: boolean) => void;
}

interface Props {
  checkboxes: CheckboxInfo[];
  label: string;
  dataCyAttr: string;
}
const CheckboxGroup = ({ checkboxes, label, dataCyAttr }: Props) => {
  const classes = useStyles();
  const checkboxElems = checkboxes.map(
    ({ label, isChecked, onChange }, index) => (
      <FormControlLabel
        key={index}
        data-cy={dataCyAttr}
        control={
          <Checkbox
            checked={isChecked}
            onChange={(event) => onChange(event.target.checked)}
          />
        }
        label={label}
      />
    )
  );
  return (
    <FormControl component="fieldset" className={classes.root}>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup row={true}>{checkboxElems}</FormGroup>
    </FormControl>
  );
};

export default CheckboxGroup;
