import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@material-ui/core/styles";
import { UploadContext } from "../../../context/Upload.Context";
import CreateNamingConvention from "../NamingConvention/CreateNamingConvention";
import Axios from "axios";
import { api_server } from "../../../environment/environment";
import { isFollowingNamingConvention } from "../../../util/files";
const useStyles = makeStyles(theme => ({
  w100: {
    width: "100%"
  }
}));

export default () => {
  const classes = useStyles();
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
      <FormControl className={classes.w100}>
        <InputLabel htmlFor="naming-convention">Naming Convention</InputLabel>
        <Select value={selectedNC} onChange={handleChange}>
          {namingConventions.map(nc => (
            <MenuItem key={nc._id} value={nc._id}>
              {nc.name}
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

function sampleNamingConvention({ elements, separator }) {
  const fixedString = len => {
    return "X".repeat(len);
  };
  const randomMember = array => {
    return array[Math.floor(array.length * Math.random())];
  };

  return elements && elements.length
    ? elements
        .map(elem =>
          !elem.type
            ? fixedString(randomMember(elem.options))
            : randomMember(elem.options)
        )
        .join(separator)
    : "";
}
