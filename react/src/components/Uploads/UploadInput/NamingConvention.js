import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import { UploadContext } from "../../../context/Upload.Context";
import CreateNamingConvention from "../NamingConvention/CreateNamingConvention";
import Axios from "axios";
import { api_server } from "../../../environment/environment";
import {
  isFollowingNamingConvention,
  sampleNamingConvention
} from "../../../util/files";

export default () => {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);

  const { files, namingConventions, ncDetails, selectedNC } = uploadProps;

  async function handleChange(event) {
    const id = event.target.value;
    const url = `${api_server}/naming-convention/contents/${id}`;
    const { data } = await Axios.get(url);
    const newFiles = files.map(file => ({
      ...file,
      ...isFollowingNamingConvention(file, data)
    }));
    uploadDispatch({
      type: "SelectedNamingConvention",
      ncDetails: data,
      selectedNC: id,
      files: newFiles
    });
  }

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel htmlFor="naming-convention">Naming Convention</InputLabel>
        <Select value={selectedNC} onChange={handleChange}>
          {namingConventions.map(nc => (
            <MenuItem key={nc._id} value={nc._id}>
              <Typography>{nc.name}</Typography>
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Sample: {sampleNamingConvention(ncDetails)}
        </FormHelperText>
      </FormControl>

      <CreateNamingConvention />
    </div>
  );
};
