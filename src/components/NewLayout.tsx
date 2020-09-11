import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import LayoutContent from "./LayoutContent";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#142166",
    },
    error: {
      main: "hsl(348, 86%, 61%)",
    },
    warning: {
      main: "hsl(48, 100%, 67%)",
    },
    info: {
      main: "hsl(204, 71%, 53%)",
    },
    success: {
      main: "hsl(141, 53%, 53%)",
    },
    background: {
      default: "#fff",
    },
  },
});

interface Props {
  title: string;
  children: React.ReactNode;
}
const Layout = ({ children, title }: Props) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <LayoutContent title={title}>{children}</LayoutContent>
      </ThemeProvider>
    </>
  );
};

export default Layout;
