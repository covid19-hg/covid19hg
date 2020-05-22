import React from "react";
import { Grid } from "./materialUIContainers";
import { makeStyles, Theme } from "@material-ui/core";

export const gridSpacing = 2;

export const listAndMapHeight = "40vh";

export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends React.ComponentType<infer TProps>
  ? TProps
  : TComponentOrTProps;
const useListMapTitleGridItemStyles = makeStyles(({ typography }: Theme) => ({
  root: {
    height: typography.h4.fontSize,
  },
}));
export const ListMapTitleGridItem = ({
  children,
  ...rest
}: ExtractProps<typeof Grid>) => {
  const classes = useListMapTitleGridItemStyles();
  return (
    <Grid item={true} className={classes.root} {...rest}>
      {children}
    </Grid>
  );
};
