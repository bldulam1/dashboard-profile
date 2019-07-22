import makeStyles from "@material-ui/core/styles/makeStyles";

const drawerWidth = 210;
const GRAY = "#707070";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    // marginRight: 0
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    color: theme.palette.primary.contrastText,
    backgroundColor: "#10000B",
    border: "0"
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    backgroundColor: "#10000B",
    color: theme.palette.primary.contrastText,
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    }
  },
  icon: {
    color: theme.palette.primary.contrastText,
    minWidth: "2rem"
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    backgroundColor: theme.palette.primary.main
  },
  navBarItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.dark
    },
    display: "flex",
    flexDirection: "row",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    cursor: "pointer",
  },
  drawerDivider: { backgroundColor: theme.palette.secondary.main },
  navBarGroupLabel: {
    paddingLeft: "0.25rem",
    textTransform: "uppercase",
    color: theme.palette.secondary.main
  },
  navBarItemLabel: {
    textTransform: "capitalize"
  },
  content: {
    flexGrow: 1,
    backgroundColor: GRAY
  },
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    height: "100%"
  },
  secondaryAvatar: {
    fontWeight: "bold",
    color: "#000",
    backgroundColor: theme.palette.secondary.main,
    height: 24,
    width: 24,
    fontSize: 12
  },
  primaryAvatar: {
    fontWeight: "bold",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    height: 24,
    width: 24,
    fontSize: 12
  }
}));

export { useStyles, drawerWidth };
