import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: "50%",
    height: "50%"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

class CustomizedDialogs extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          color="secondary"
          onClick={this.handleClickOpen}
        >
          Open dialog
        </Button>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            Create New Naming Convention
          </DialogTitle>
          <DialogContent dividers>
            <form>
              <TextField
                id="standard-name"
                label="Date"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Time"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Function"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Customer"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Hardware"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Software"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Rec Location"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Vehicle"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Test Catalog Label"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Major"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              {/* <TextField
                id="standard-name"
                label="Minor"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              /> */}
              <InputLabel htmlFor="age-simple" fullWidth>Minor</InputLabel>
              <Select
                // value={values.age}
                // onChange={handleChange}
                inputProps={{
                  label: "Minor",
                  id: "Minor_"
                }} fullWidth
              >
                <MenuItem value={3}>3 Digit</MenuItem>
                <MenuItem value={4}>4 Digit</MenuItem>
              </Select>


              <TextField
                id="standard-name"
                label="Side"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
              <TextField
                id="standard-name"
                label="Iteration"
                // className={classes.textField}
                // value={values.name}
                // onChange={handleChange("name")}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CustomizedDialogs;
