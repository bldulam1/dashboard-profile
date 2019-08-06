import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import uuid from "uuid/v4";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
// import CreateIcon from "@material-ui/icons/Create";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Axios from "axios";
import { api_server } from "../../../environment/environment";
import { useSnackbar } from "notistack";
import { DialogTitle, DialogContent, DialogActions } from "./DialogComponents";
import { ProjectContext } from "../../../context/Project.Context";

function getNCSample(elements) {
  return elements
    .map(({ type, options }) => {
      const splits = options.split(",");
      return type
        ? splits[splits.length - 1]
        : "x".repeat(1 * splits[splits.length - 1]);
    })
    .join("_");
}

export default params => {
  const { activeProject } = React.useContext(ProjectContext);
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);
  const [elements, setElements] = React.useState([NC_Element("", 1, "")]);
  const [property, setProperty] = React.useState({
    name: "",
    extensions: "",
    separator: ""
  });
  const isNCValid = () => {
    const { name, extensions, separator } = property;
    const lastElement = elements[elements.length - 1];
    return name.length &&
      extensions.length &&
      separator.length &&
      lastElement.key.length &&
      lastElement.options.length
      ? true
      : false;
  };

  const handleRemoveElement = index => {
    const newElements = elements.filter((elem, ind) => ind !== index);
    setElements(newElements);
  };
  const handleAddElement = () =>
    setElements([...elements, NC_Element("", 1, "")]);

  const handleUpdateElement = (index, newElement) => {
    let newElements = elements;
    newElements[index] = newElement;
    setElements([...newElements]);
  };
  const handlePropertyChange = (event, name) => {
    const { value } = event.target;
    if (name === "separator") {
      if (!value.match(/[A-Za-z0-9]/i)) {
        setProperty({
          ...property,
          [name]: value.length ? value[value.length - 1] : ""
        });
      }
    } else {
      setProperty({ ...property, [name]: value });
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    const body = {
      elements: elements.map(elem => ({
        ...elem,
        options: elem.options.split(",").map(opt => opt.trim())
      })),
      ...property,
      extensions: property.extensions.split(",").map(ext => ext.trim()),
      project: activeProject
    };
    const { data: { _id, name } } = await Axios.post(
      `${api_server}/naming-convention/new`,
      body
    );

    enqueueSnackbar(`${name} created. ID: ${_id}`, { variant: "success" });
    handleClose();
  };

  const typeOptions = ["Fixed Length", "String Options"];
  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        size="small"
      >
        Create New
      </Button>
      <Button size="small" color="secondary" variant="outlined">
        Edit
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle
          disableTypography={true}
          id="customized-dialog-title"
          onClose={handleClose}
        >
          New Naming Convention
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" align="center">
            {getNCSample(elements) || "Preview"}
          </Typography>
          <hr />
          <Typography style={{ marginTop: "1rem" }} variant="subtitle2">
            Properties
          </Typography>
          <TextField
            required={true}
            label="Name"
            fullWidth
            value={property.name}
            onChange={event => handlePropertyChange(event, "name")}
          />
          <TextField
            required={true}
            label="Extensions"
            style={{ width: "50%" }}
            value={property.extensions}
            onChange={event => handlePropertyChange(event, "extensions")}
          />
          <TextField
            required={true}
            label="Separator"
            style={{ width: "50%" }}
            value={property.separator}
            onChange={event => handlePropertyChange(event, "separator")}
          />
          <Typography style={{ marginTop: "1rem" }} variant="subtitle2">
            Fields
          </Typography>
          <form
            style={{ display: "flex", flexWrap: "wrap", width: "100%" }}
            noValidate
            autoComplete="off"
            onSubmit={e => e.preventDefault()}
          >
            {elements.map((element, elemIndex) => (
              <NCElement
                key={uuid()}
                element={element}
                typeOptions={typeOptions}
                index={elemIndex}
                isLastIndex={elemIndex === elements.length - 1}
                handleRemoveElement={handleRemoveElement}
                handleAddElement={handleAddElement}
                handleUpdateElement={handleUpdateElement}
                disabled={elements.length < 2}
              />
            ))}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleSubmit()}
            color="primary"
            disabled={!isNCValid()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

function NC_Element(key, type, options) {
  return { key, type, options };
}

function isNumeric(str) {
  if (str.match(/[a-z]/i) || str.includes(".")) {
    return false;
  }

  let isNum = true;
  const splits = str.split(",");

  for (let index = 0; index < splits.length; index++) {
    const subst = splits[index];
    if (isNaN(subst) || parseInt(subst) > 15) {
      isNum = false;
      break;
    }
  }
  return isNum;
}

function NCElement(props) {
  const {
    element,
    handleAddElement,
    handleRemoveElement,
    handleUpdateElement,
    index,
    typeOptions,
    isLastIndex,
    disabled
  } = props;

  const [nc_element, setNC_element] = React.useState(element);

  const onElementChange = (event, name) => {
    // console.log(event.target.value, nc_element.type);
    const newElement = { ...nc_element, [name]: event.target.value };

    if (
      name === "options" &&
      !nc_element.type &&
      !isNumeric(event.target.value)
    ) {
      return;
    }
    setNC_element(newElement);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (nc_element.key.length && nc_element.options.length) {
      handleUpdateElement(index, nc_element);
      handleAddElement();
    }
  };

  return (
    <React.Fragment>
      <TextField
        required={true}
        style={{ width: "10%" }}
        label="Key"
        value={nc_element.key}
        onChange={event => onElementChange(event, "key")}
      />
      <FormControl style={{ width: "25%" }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={nc_element.type}
          onChange={event => onElementChange(event, "type")}
        >
          {typeOptions.map((type, index) => (
            <MenuItem key={"type" + index} value={index}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        required={true}
        style={{ width: "55%" }}
        label="Values"
        value={nc_element.options}
        onChange={event => onElementChange(event, "options")}
      />
      <IconButton
        edge="end"
        aria-label="delete"
        disabled={disabled}
        onClick={() => handleRemoveElement(index)}
      >
        <RemoveCircleIcon color={disabled ? "disabled" : "error"} />
      </IconButton>
      {/* <IconButton
        edge="end"
        aria-label="delete"
        disabled={disabled}
        onClick={() => handleRemoveElement(index)}
      >
        <CreateIcon color={disabled ? "disabled" : "error"} />
      </IconButton> */}
      {isLastIndex && (
        <div>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={handleSubmit}
            disabled={!nc_element.options.length || !nc_element.key.length}
          >
            <AddCircleIcon
              color={
                nc_element.options.length && nc_element.key.length
                  ? "primary"
                  : "disabled"
              }
            />
          </IconButton>
        </div>
      )}
    </React.Fragment>
  );
}
