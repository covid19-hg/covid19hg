import React, { useState } from "react";
import {
  makeStyles,
  Theme,
  AppBar,
  Drawer,
  Toolbar,
  Typography,
  IconButton,
  Hidden,
  Divider,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Link,
} from "@material-ui/core";
import DefaultHelmet from "./DefaultHelmet";
import useSiteMetadata from "./SiteMetadata";
import { Link as GatsbyLink } from "gatsby";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  appBarDesktop: {
    width: `calc(100% - ${drawerWidthFromTheme(theme)}px)`,
    marginLeft: drawerWidthFromTheme(theme),
  },
  appBarMobile: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidthFromTheme(theme)}px)`,
    marginLeft: drawerWidthFromTheme(theme),
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidthFromTheme(theme),
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidthFromTheme(theme),
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  logo: {
    borderRadius: theme.shape.borderRadius,
  },
  logoImage: {
    width: theme.spacing(20),
  },
  arrowIcon: {
    justifySelf: "flex-end",
  },
  navLink: {
    "&:visited": {
      color: theme.palette.primary.main,
    },
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  contentDesktop: {
    backgroundColor: theme.palette.background.default,
    marginLeft: drawerWidthFromTheme(theme),
  },
  contentMobile: {
    width: "100%",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidthFromTheme(theme),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

const drawerWidthFromTheme = (theme: Theme) => theme.spacing(30);
interface Props {
  title: string;
  children: React.ReactNode;
}

const LayoutContent = ({ title, children }: Props) => {
  const classes = useStyles();
  const { title: siteTitle, description, siteUrl } = useSiteMetadata();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [isOpenNonDesktop, setIsOpenNonDesktop] = useState<boolean>(false);
  const isOpen = isDesktop ? true : isOpenNonDesktop;
  const openDrawer = () => setIsOpenNonDesktop(true);
  const closeDrawer = () => setIsOpenNonDesktop(false);
  const drawerVariant = isDesktop ? "permanent" : "persistent";

  const linkInfo = [
    { href: "/", label: "Home" },
    { href: "/about/", label: "About" },
    { href: "/partners/", label: "Partners" },
    { href: "/projects/", label: "Projects" },
    { href: "/data-sharing/", label: "Data Sharing" },
    { href: "/blog/", label: "News" },
    { href: "/meeting-archive/", label: "Meeting Archive" },
    { href: "/contact/", label: "Contact" },
    { href: "/register/", label: "Register" },
    { href: "/results/", label: "Results" },
    {
      href: "/blog/2020-06-29-in-silico-follow-up-results/",
      label: (
        <React.Fragment>
          <em>In silico</em> follow-up results
        </React.Fragment>
      ),
    },
    { href: "/acknowledgements/", label: "Acknowledgements" },
    { href: "/media/", label: "Media" },
  ];
  const drawerItems = linkInfo.map(({ href, label }, index) => (
    <ListItem button={false} key={index}>
      <ListItemText>
        <Link
          component={GatsbyLink}
          to={href}
          className={classes.navLink}
          underline="none"
        >
          {label}
        </Link>
      </ListItemText>
    </ListItem>
  ));
  return (
    <>
      <DefaultHelmet
        title={title}
        description={description}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
      />
      <AppBar
        position="fixed"
        className={clsx({
          [classes.appBarDesktop]: isDesktop,
          [classes.appBarMobile]: !isDesktop,
          [classes.appBarShift]: !isDesktop && isOpenNonDesktop,
        })}
        color="primary"
      >
        <Toolbar>
          <Hidden mdUp={true}>
            <IconButton
              aria-label="open drawer"
              onClick={openDrawer}
              edge="start"
              color="inherit"
              className={clsx(classes.menuButton, {
                [classes.hide]: !isDesktop && isOpenNonDesktop,
              })}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant={drawerVariant}
        anchor="left"
        open={isOpen}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
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
          <Hidden mdUp={true}>
            <IconButton onClick={closeDrawer} className={classes.arrowIcon}>
              <ChevronLeftIcon />
            </IconButton>
          </Hidden>
        </div>
        <Divider />
        <List> {drawerItems} </List>
      </Drawer>
      <div
        className={clsx({
          [classes.contentDesktop]: isDesktop,
          [classes.contentMobile]: !isDesktop,
          [classes.contentShift]: !isDesktop && isOpenNonDesktop,
        })}
      >
        <div className={classes.toolbar} />
        {children}
      </div>
    </>
  );
};

export default LayoutContent;
