import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { UploadContext } from "../../../context/Upload.Context";

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
