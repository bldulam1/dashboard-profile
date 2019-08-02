import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { UploadContext } from "../../../context/Upload.Context";

export default params => {
  const {rootPath, storageLocation, setStorageLocation } = React.useContext(
    UploadContext
  );


  const handleChange = event => {
    setStorageLocation(rootPath + event.target.value)
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
      // value={storageLocation.replace(rootPath, '')}
    />
  );
};
