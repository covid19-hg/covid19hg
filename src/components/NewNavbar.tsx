import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ExtractProps } from "./partnersPageStylingParams";
import OriginalTabs from "@material-ui/core/Tabs";
import OriginalTab, {
  TabProps as OriginalTabProps,
} from "@material-ui/core/Tab";
import { Link as GatsbyLink } from "gatsby";
import _noop from "lodash/noop";
import { Hidden } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const useTabStyles = makeStyles((theme: Theme) => ({
  root: {
    textTransform: "none",
    [theme.breakpoints.up("sm")]: {
      fontSize: theme.typography.body1.fontSize,
      minWidth: theme.spacing(5),
      color: theme.palette.text.primary,
    },
    "&:hover": {
      color: theme.palette.primary.main,
      opacity: 1,
    },
  },
}));

type TabProps = OriginalTabProps & { href: string };
const Tab = ({ href, label }: TabProps) => {
  const classes = useTabStyles();
  return (
    <OriginalTab
      component={GatsbyLink}
      to={href}
      className={classes.root}
      label={label}
    />
  );
};

const useTabsStyles = makeStyles(() => ({
  indicator: {
    backgroundColor: "transparent",
  },
}));
const Tabs = (props: ExtractProps<typeof OriginalTabs>) => {
  const classes = useTabsStyles();
  return <OriginalTabs classes={{ indicator: classes.indicator }} {...props} />;
};

const useStyles = makeStyles((theme: Theme) => ({
  appbar: {
    backgroundColor: theme.palette.background.default,
  },
  logo: {
    borderRadius: theme.shape.borderRadius,
  },
  logoImage: {
    width: theme.spacing(20),
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const linkInfo = [
    { href: "/about/", label: "About" },
    { href: "/partners/", label: "Partners" },
    { href: "/data-sharing/", label: "Data Sharing" },
    { href: "/blog/", label: "News" },
    { href: "/meeting-archive/", label: "Meeting Archive" },
    { href: "/contact/", label: "Contact" },
    { href: "/register/", label: "Register" },
    { href: "/results/", label: "Results" },
  ];
  const tabs = linkInfo.map(({ href, label }, index) => (
    <Tab color="primary" label={label} key={index} href={href} />
  ));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);
  const onHamburgerClick = (e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget as HTMLElement);
  };
  const handleClose = () => setAnchorEl(null);
  const menuItems = linkInfo.map(({ href, label }) => (
    <MenuItem component={GatsbyLink} to={href} onClick={handleClose} key={href}>
      {label}
    </MenuItem>
  ));
  const menu = (
    <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose}>
      {menuItems}
    </Menu>
  );
  return (
    <>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Hidden mdUp={true}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onHamburgerClick}
            >
              <MenuIcon color="primary" />
            </IconButton>
          </Hidden>
          {menu}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.logo}
            component={GatsbyLink}
            to={"/"}
          >
            <img
              src={"/img/logo.png"}
              alt="Logo"
              className={classes.logoImage}
            />
          </IconButton>
          <Hidden smDown={true}>
            <Tabs value={false} centered={true} onChange={_noop}>
              {tabs}
            </Tabs>
          </Hidden>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default NavBar;
