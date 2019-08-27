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
import { getRelationOptions } from "../../../../util/search";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
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


// function SelectTypeField() {
//   const classes = useStyles();
//   const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
//   const { advancedQuery } = searchFileProps;

//   function handleChange(event, _field) {
//     let _advancedQuery = advancedQuery;
//     const newValue = event.target.value;
//     const findDFS = (objects, id, field) => {
//       for (let o of objects || []) {
//         if (o.id === id) {
//           o[field] = newValue;
//           if (field === "_key") {
//             o.relationOptions = getRelationOptions(newValue);
//             o.relation = o.relationOptions[0].value;
//           }
//         }
//         const o_ = findDFS(o.items, id, field);
//         if (o_) {
//           o_[field] = newValue;
//           if (field === "_key") {
//             o_.relationOptions = getRelationOptions(newValue);
//             o_.relation = o_.relationOptions[0].value;
//           }
//         }
//       }
//     };

//     findDFS([_advancedQuery], id, _field);
//     searchFileDispatch({
//       advancedQuery: _advancedQuery
//     });
//   }

//   return (
//     <FormControl className={classes.formControl}>
//       <Tooltip title="Key">
//         <Select
//           value={_key}
//           onChange={event => handleChange(event, "_key")}
//           inputProps={{
//             name: "key",
//             id: "key-simple"
//           }}
//         >
//           {keyOptions.map(keyOption => (
//             <MenuItem key={uuid()} value={keyOption.dbName}>
//               {keyOption.dispName}
//             </MenuItem>
//           ))}
//         </Select>
//       </Tooltip>
//     </FormControl>
//   );
// }

function QueryItem({ id }) {
  const classes = useStyles();
  const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  const { advancedQuery } = searchFileProps;

  const {
    _key,
    keyOptions,
    // value,
    // valueOptions,
    relation,
    relationOptions
  } = getObjectFields([advancedQuery], id);

  function handleChange(event, _field) {
    let _advancedQuery = advancedQuery;
    const newValue = event.target.value;
    const findDFS = (objects, id, field) => {
      for (let o of objects || []) {
        if (o.id === id) {
          o[field] = newValue;
          if (field === "_key") {
            o.relationOptions = getRelationOptions(newValue);
            o.relation = o.relationOptions[0].value;
          }
        }
        const o_ = findDFS(o.items, id, field);
        if (o_) {
          o_[field] = newValue;
          if (field === "_key") {
            o_.relationOptions = getRelationOptions(newValue);
            o_.relation = o_.relationOptions[0].value;
          }
        }
      }
    };

    findDFS([_advancedQuery], id, _field);
    searchFileDispatch({
      advancedQuery: _advancedQuery
    });
  }

  return (
    <form className={classes.root} autoComplete="off">
      <IconButton className={classes.button} aria-label="delete">
        <DeleteIcon color="error" />
      </IconButton>

      <FormControl className={classes.formControl}>
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

      <FormControl className={classes.formControl}>
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

      <FormControl className={classes.formControl}>
        <Tooltip title="value">
          <Select
            value={_key}
            onChange={event => handleChange(event, "relation")}
            inputProps={{
              name: "relation",
              id: "relation-simple"
            }}
          >
            {/* {relationOptions.map(relOption => (
              <MenuItem key={uuid()} value={relOption.value}>
                {relOption.display}
              </MenuItem>
            ))} */}
          </Select>
        </Tooltip>
      </FormControl>
    </form>
  );
}

export default QueryItem;
