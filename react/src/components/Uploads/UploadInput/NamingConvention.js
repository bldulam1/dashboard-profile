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
import { ProjectContext } from "../../../context/Project.Context";
const useStyles = makeStyles(theme => ({
  w100: {
    width: "100%"
  }
}));

export default () => {
  const classes = useStyles();
  const {
    setSelectedNamingConvention,
    selectedNamingConvention,
    ncDetails,
    setNCDetails
  } = React.useContext(UploadContext);
  const { activeProject } = React.useContext(ProjectContext);
  const [namingConventions, setNamingConventions] = React.useState([]);

  React.useEffect(() => {
    const url = `${api_server}/naming-convention/distinct/${activeProject}/names`;
    Axios.get(url).then(res => {
      setNamingConventions(res.data);
    });
  }, []);

  function handleChange(event) {
    const id = event.target.value;
    const url = `${api_server}/naming-convention/contents/${id}`;
    Axios.get(url).then(res => {
      setNCDetails(res.data);
    });
    setSelectedNamingConvention(event.target.value);
  }

  return (
    <div>
      <FormControl className={classes.w100}>
        <InputLabel htmlFor="naming-convention">Naming Convention</InputLabel>
        <Select
          value={selectedNamingConvention}
          onChange={handleChange}
          inputProps={{
            name: "age",
            id: "naming-convention"
          }}
        >
          {namingConventions.map(nc => (
            <MenuItem key={nc._id} value={nc._id}>
              {nc.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {/* Sample: {selectedNamingConvention} */}
          Sample: {sampleNamingConvention(ncDetails)}
        </FormHelperText>
      </FormControl>

      <CreateNamingConvention />
    </div>
  );
};

function sampleNamingConvention({ elements, separator }) {
  const fixedString = len => {
    let tempChar = "X";
    let retString = "";
    for (let index = 0; index < len; index++) {
      retString = retString + tempChar;
    }
    return retString;
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
