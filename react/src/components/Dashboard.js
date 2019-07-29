import React from "react";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "../styles/classes";
import { api_server } from "../environment/environment";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

export default props => {
  const classes = useStyles();
  const [numClicks, setNumClicks] = React.useState(10);
  return (
    <Paper className={classes.contentPaper}>
      <Typography variant="h1" component="h2" gutterBottom>
        Number of Clicks {numClicks}
      </Typography>
      <Button
        onClick={() => {
          const _numClicks = numClicks;
          setNumClicks(_numClicks + 1);
        }}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Increment
      </Button>
      <Button
        onClick={() => {
          const _numClicks = numClicks;
          setNumClicks(_numClicks - 1);
        }}
        variant="contained"
        color="secondary"
        className={classes.button}
      >
        Decrement
      </Button>
    </Paper>
  );
};
