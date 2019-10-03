import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import Axios from "axios";
import { api_server } from "../../../../environment/environment";
import { ProjectContext } from "../../../../context/Project.Context";

const useStyles = makeStyles(theme => ({
  dropZoneOuter: {
    backgroundColor: "#707070",
    color: "white",
    width: "90%",
    height: "90%",
    minHeight: "10rem",
    textAlign: "center",
    borderRadius: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    cursor: "pointer"
  },
  dropZoneInner: {
    margin: "auto",
    padding: "2%",
    width: "97%",
    height: "97%",
    border: "1px solid #E0C1CB",
    borderRadius: "0.95rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

export default () => {
  const classes = useStyles();
  const { activeProject } = useContext(ProjectContext);
  const defaultState = {
    formData: new FormData(),
    count: 0
  };

  const [state, setState] = useState(defaultState);

  const onDrop = useCallback(acceptedFiles => {
    let formData = new FormData();
    const count = acceptedFiles.length;
    for (let index = 0; index < count; index++) {
      const file = acceptedFiles[index];
      formData.append("files", file, file.name);
    }
    setState({ formData, count });
  }, []);

  const url = `${api_server}/tc/${activeProject}/update`;
  const handleSubmit = () => {
    Axios.post(url, state.formData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    }).then(results => {
      console.log(results.data);
      setState(defaultState);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>
          Upload/Update Test Catalog
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className={classes.dropZoneOuter}>
          <div className={classes.dropZoneInner} {...getRootProps({})}>
            <input
              {...getInputProps({
                onDrop: event => console.log(event)
              })}
            />
            <Typography variant="h6">
              {state.count
                ? `${state.count} file${
                    state.count > 1 ? "s" : ""
                  } ready to be uploaded`
                : isDragActive
                ? "Drop the files here"
                : "Drop some files here, or click to select files"}
            </Typography>
          </div>
        </div>
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <Button size="small">Cancel</Button>
        <Button
          size="small"
          color="primary"
          onClick={handleSubmit}
          disabled={!state.count}
        >
          Send
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};
