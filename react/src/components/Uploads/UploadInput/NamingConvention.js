import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  w100: {
    width: "100%"
  }
}));

export default props => {
  const classes = useStyles();

  const namingConventions = [
    NConvention(
      "NC01",
      [
        NCElement("date", "8", null),
        NCElement("time", "6", null),
        NCElement("function", null, ["RC", "ASD"])
      ],
      "_"
    ),
    NConvention(
      "NC02",
      [
        NCElement("date", "8", null),
        NCElement("time", "6", null),
        NCElement("function", null, ["RC", "ASD"])
      ],
      "^"
    )
  ];

  const [
    selectedNamingConvention,
    setSelectedNamingConvention
  ] = React.useState("NC01");

  function handleChange(event) {
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
            <MenuItem key={"nc-" + nc.name} value={nc.name}>
              {nc.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Sample: {sampleNamingConvention(namingConventions[1])}
        </FormHelperText>
      </FormControl>
      <div>
        <Button size="small" color="primary" variant="outlined">
          Create New
        </Button>
        <Button size="small" color="secondary" variant="outlined">
          Edit
        </Button>
      </div>
    </div>
  );
};

function NCElement(name, length, options) {
  return { name, length, options };
}

function NConvention(name, elements, separator) {
  return { name, elements, separator };
}

function sampleNamingConvention({ elements, separator }) {
  function fixedString(len) {
    let tempChar = "X";
    let retString = "";
    for (let index = 0; index < len; index++) {
      retString = retString + tempChar;
    }
    return retString;
  }

  return elements
    .map(elem =>
      elem.length
        ? fixedString(elem.length)
        : elem.options[Math.floor(elem.options.length * Math.random())]
    )
    .join(separator);
}
