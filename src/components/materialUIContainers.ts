import OriginalContainer from "@material-ui/core/Container";
import OriginalGrid from "@material-ui/core/Grid";
import { styled } from "@material-ui/core/styles";
import {
  compose,
  sizing,
  flexbox,
  display,
  typography,
  spacing,
} from "@material-ui/system";

export const Grid = styled(OriginalGrid)(
  compose(sizing, spacing, display, flexbox)
);
export const Container = styled(OriginalContainer)(
  compose(sizing, flexbox, display, typography, spacing)
);
