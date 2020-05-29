import React from "react";
import { makeStyles } from "@material-ui/styles";
import { FormControl, TextField, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "block",
    marginTop: theme.spacing(1),
  },
  keywordSearchOutline: {
    borderColor: "rgb(51, 51, 51)",
    borderRadius: 0,
  },
}));

interface Props {
  label: string;
  onChange: (value: string) => void;
}

const TextSearch = ({ label, onChange }: Props) => {
  const classes = useStyles();
  return (
    // @ts-ignore need to look deeper into Material UI's type definition to see why this errors out.
    <FormControl comnponent="fieldset" className={classes.root}>
      <TextField
        id="standard-basic"
        label={label}
        variant="outlined"
        fullWidth={true}
        InputProps={{
          classes: {
            notchedOutline: classes.keywordSearchOutline,
          },
        }}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormControl>
  );
};

export default TextSearch;
