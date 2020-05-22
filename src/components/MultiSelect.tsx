import React from "react";
import {
  FormControl,
  FormLabel,
  FormGroup,
  Input,
  MenuItem,
  Select,
  Chip,
  Theme,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(0, 1),
    borderWidth: 1,
    borderStyle: "solid",
    display: "block",
    minHeight: "65px",
  },
  select: {
    "&&:focus": {
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
  },
}));

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  label: string;
}
const MultiSelect = ({ value, onChange, options, label }: Props) => {
  const classes = useStyles();
  return (
    <FormControl component="fieldset" className={classes.root}>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup>
        <Select
          id="partners-assays-planned"
          multiple={true}
          value={value}
          className={classes.select}
          onChange={(event) => onChange(event.target.value as string[])}
          input={<Input disableUnderline={true} />}
          renderValue={(selected) => (
            <Box display="flex" flexWrap="wrap">
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} component={Box} margin={0.25} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {options.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormGroup>
    </FormControl>
  );
};

export default MultiSelect;
