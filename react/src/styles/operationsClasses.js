import makeStyles from "@material-ui/core/styles/makeStyles";

export const useOperationStyles = makeStyles(theme => ({
  expansionPanelDetails: {
    display: "flex",
    flexDirection: "column"
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  breakWord: {
    wordWrap: "break-word"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "60%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
}));