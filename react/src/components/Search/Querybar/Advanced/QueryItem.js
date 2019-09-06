import React, { useContext } from "react";
import { FileSearchContext } from "../../../../context/Search.Context";
import { makeStyles } from "@material-ui/styles";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import uuid from "uuid/v4";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import {
  getRelationOptions,
  keyOptions,
  parseQueryGroup
} from "../../../../util/search";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { fetchScenesData } from "../../../../util/scenes-search";

let timeOutTimer = null;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  button: {
    padding: theme.spacing(1),
    marginRight: theme.spacing(2)
  },
  formControl1: {
    marginRight: theme.spacing(1),
    minWidth: 70
  },
  formControl2: {
    marginRight: theme.spacing(1),
    minWidth: 200
  },
  formControl3: {
    marginRight: theme.spacing(1),
    minWidth: 300
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function getObjectFields(objects, id) {
  for (let o of objects || []) {
    if (o.id === id) return o;
    const o_ = getObjectFields(o.items, id);
    if (o_) return o_;
  }
}

function QueryItem({ id }) {
  const classes = useStyles();
  const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  const { advancedQuery, project, limit, sort } = searchFileProps;

  const { _key, relation, relationOptions, value } = getObjectFields(
    [advancedQuery],
    id
  );

  function handleChange(event, _field) {
    let _advancedQuery = advancedQuery;
    const newValue = event.target.value;
    const updateObjectMember = (objects, id, field) => {
      for (let o of objects || []) {
        if (o.id === id) {
          o[field] = newValue;
          if (field === "_key") {
            o.relationOptions = getRelationOptions(newValue);
            o.relation = o.relationOptions[0].value;
          }
        } else {
          updateObjectMember(o.items, id, field);
        }
      }
    };

    updateObjectMember([_advancedQuery], id, _field);
    searchFileDispatch({ advancedQuery: _advancedQuery });
    refreshScenes(project, limit, sort, _advancedQuery, results =>
      searchFileDispatch(results)
    );
  }

  function handleDeleteCondition() {
    let _advancedQuery = [advancedQuery];
    const deleteMember = (data, id) => {
      for (const key in data) {
        if (data[key].id === id) {
          return data.filter(d => d.id !== id);
        } else if (data[key].type === "group") {
          const newItems = deleteMember(data[key].items, id);
          data[key].items = newItems;
          return data;
        }
      }
    };
    _advancedQuery = deleteMember(_advancedQuery, id)[0];
    refreshScenes(project, limit, sort, _advancedQuery, results =>
      searchFileDispatch(results)
    );
    searchFileDispatch({ advancedQuery: _advancedQuery });
  }

  return (
    <form className={classes.root} autoComplete="off">
      <IconButton
        className={classes.button}
        aria-label="delete"
        onClick={handleDeleteCondition}
      >
        <DeleteIcon color="error" />
      </IconButton>

      <FormControl className={classes.formControl2}>
        <Tooltip title="Key">
          <Select
            value={_key}
            onChange={event => handleChange(event, "_key")}
            inputProps={{
              name: "key",
              id: "key-simple"
            }}
          >
            {keyOptions.map(keyOption => (
              <MenuItem key={uuid()} value={keyOption.dbName}>
                {keyOption.dispName}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </FormControl>

      <FormControl className={classes.formControl1}>
        <Tooltip title="Relation">
          <Select
            value={relation}
            onChange={event => handleChange(event, "relation")}
            inputProps={{
              name: "relation",
              id: "relation-simple"
            }}
          >
            {relationOptions.map(relOption => (
              <MenuItem key={uuid()} value={relOption.value}>
                {relOption.display}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </FormControl>
      <ValueField id={id} _key={_key} value={value} />
    </form>
  );
}

export default QueryItem;

function refreshScenes(project, limit, sort, _advancedQuery, callback) {
  clearTimeout(timeOutTimer);
  timeOutTimer = setTimeout(() => {
    const newQuery = { $and: [{ project }, parseQueryGroup(_advancedQuery)] };
    fetchScenesData(
      { project, skip: 0, limit, query: newQuery, sort },
      results => callback({ ...results, skip: 0, query: newQuery })
    );
  }, 1000);
}

function ValueField(props) {
  const classes = useStyles();
  const { _key, value, id } = props;
  const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  const {
    extensionOptions,
    rootOptions,
    advancedQuery,
    project,
    limit,
    sort
  } = searchFileProps;

  // console.log(_key)
  const options = _key === "extension" ? extensionOptions : rootOptions;
  const isTextFieldGroup = ["fileName", "path", "size"].includes(_key);
  const isNumber = ["size"].includes(_key);
  const isSelectGroup = ["extension", "root"].includes(_key);
  const isDateGroup = _key.includes("date");

  function handleChange(event, _field) {
    let _advancedQuery = advancedQuery;
    const newValue = _key.includes("date")
      ? new Date(event)
      : event.target.value;
    const updateObjectMember = (objects, id, field) => {
      for (let o of objects || []) {
        if (o.id === id) {
          o[field] = newValue;
          if (field === "_key") {
            o.relationOptions = getRelationOptions(newValue);
            o.relation = o.relationOptions[0].value;
          }
        } else {
          updateObjectMember(o.items, id, field);
        }
      }
    };

    updateObjectMember([_advancedQuery], id, _field);
    searchFileDispatch({ advancedQuery: _advancedQuery });
    refreshScenes(project, limit, sort, _advancedQuery, results =>
      searchFileDispatch(results)
    );
  }

  return (
    <FormControl className={classes.formControl3}>
      <Tooltip title="value">
        <div>
          {isSelectGroup && (
            <Select
              className={classes.formControl3}
              value={value}
              onChange={event => handleChange(event, "value")}
              inputProps={{
                name: "value",
                id: "value-simple"
              }}
            >
              {options.map(option => (
                <MenuItem key={uuid()} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
          {isTextFieldGroup && (
            <TextField
              id="textfield-value"
              className={classes.formControl3}
              type={isNumber ? "number" : "search"}
              value={value}
              onChange={event => handleChange(event, "value")}
            />
          )}
          {isDateGroup && (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="dense"
                style={{ marginTop: 3 }}
                id="date-picker-dialog"
                format="MM/dd/yyyy"
                value={value instanceof Date ? value : new Date()}
                onChange={date => handleChange(date, "value")}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
            </MuiPickersUtilsProvider>
          )}
        </div>
      </Tooltip>
    </FormControl>
  );
}
