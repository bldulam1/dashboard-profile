import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { UploadContext } from "../../../context/Upload.Context";
import Slider from "@material-ui/core/Slider";
export default params => {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);
  const { ampCheck, messieCheck } = uploadProps.preUploadOperations;

  const handleCBChange = type => {
    const preUploadOperations = {
      ...uploadProps.preUploadOperations,
      [type]: {
        ...uploadProps.preUploadOperations[type],
        value: !uploadProps.preUploadOperations[type].value
      }
    };
    uploadDispatch({
      type: "PreUploadOperations",
      preUploadOperations
    });
  };
  return (
    <div>
      <Typography id="discrete-slider" gutterBottom>
        Good Frame Threshold (%)
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            disabled={ampCheck.disabled}
            value={ampCheck.value}
            onChange={() => handleCBChange("ampCheck")}
          />
        }
        label="AMP Check"
      />
      {ampCheck.value && <AmpCheckParameters />}
      <br />
      <FormControlLabel
        control={
          <Checkbox
            disabled={messieCheck.disabled}
            value={messieCheck.value}
            onChange={() => handleCBChange("messieCheck")}
          />
        }
        label="Messie Check"
      />
    </div>
  );
};

function AmpCheckParameters() {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);
  const {
    threshold,
    minimumFrame
  } = uploadProps.preUploadOperations.ampCheck.parameters;

  const handleChange = name => (event, value) => {
    const preUploadOperations = {
      ...uploadProps.preUploadOperations,
      ampCheck: {
        ...uploadProps.preUploadOperations.ampCheck,
        parameters: {
          ...uploadProps.preUploadOperations.ampCheck.parameters,
          [name]: value ? value : event.target.value
        }
      }
    };
    uploadDispatch({
      type: "PreUploadOperations",
      preUploadOperations
    });
  };

  return (
    <React.Fragment>
      <Slider
        value={threshold}
        getAriaValueText={value=>`${value}%`}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="on"
        step={0.1}
        marks
        min={80}
        max={100}
        onChange={handleChange("threshold")}
      />
      <TextField
        id="id-minimumFrame"
        label="Minimum Frame"
        defaultValue={minimumFrame}
        onChange={handleChange("minimumFrame")}
        type="number"
        margin="normal"
        fullWidth
      />
    </React.Fragment>
  );
}
