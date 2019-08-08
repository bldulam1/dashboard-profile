import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { UploadContext } from "../../../context/Upload.Context";

export default params => {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);
  const { rootPath } = uploadProps;

  const handleChange = event => {
    uploadDispatch({
      storageLocation: rootPath + event.target.value,
      type: "StorageLocation"
    });
  };

  return (
    <TextField
      fullWidth
      label="Storage Location"
      id="simple-start-adornment"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{rootPath}</InputAdornment>
        )
      }}
      onChange={handleChange}
      value={uploadProps.storageLocation.replace(rootPath, "")}
    />
  );
};
