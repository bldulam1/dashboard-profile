import React from 'react';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

export default (params) => {
  return (
    <TextField
      label="Storage Location"
      id="simple-start-adornment"
      // className={clsx(classes.margin, classes.textField)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">V:\JP01\DataLake\</InputAdornment>
        )
      }}
    />
  );
};
