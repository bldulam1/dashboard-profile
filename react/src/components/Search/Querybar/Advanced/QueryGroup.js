import React, { useContext } from "react";
import { FileSearchContext } from "../../../../context/Search.Context";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import QueryItem from "./QueryItem";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { QueryItemObject, QueryGroupObject } from "../../../../util/search";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(1),
    marginRight: theme.spacing(2)
  }
}));

function QueryGroup(props) {
  const classes = useStyles();
  const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  const { advancedQuery } = searchFileProps;
  const { id, operator, items } = props;

  const handleOperatorToggle = () => {
    let _advancedQuery = advancedQuery;

    const toggleOperator = (objects, id) => {
      for (let obj of objects || []) {
        if (obj.id === id) obj.operator = obj.operator === "and" ? "or" : "and";
        const obj_ = toggleOperator(obj.items, id);
        if (obj_) obj_.operator = obj_.operator === "and" ? "or" : "and";
      }
    };

    toggleOperator([_advancedQuery], id);
    searchFileDispatch({
      advancedQuery: _advancedQuery
    });
  };

  const handleNewItem = (id, type) => {
    let _advancedQuery = advancedQuery;
    const newItem =
      type === "group"
        ? QueryGroupObject("and", [QueryItemObject("fileName", "", "w")])
        : QueryItemObject("fileName", "", "w");

    const inserItem = (data, id, newItem) => {
      for (const key in data) {
        if (data[key].id === id) {
          data[key].items = [...data[key].items, newItem];
          return data;
        } else if (data[key].type === "group") {
          const newItems = inserItem(data[key].items, id, newItem);
          data[key].items = newItems;
          return data;
        }
      }
    };
    _advancedQuery = inserItem([_advancedQuery], id, newItem)[0];
    searchFileDispatch({ advancedQuery: _advancedQuery });
  };

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
    searchFileDispatch({ advancedQuery: _advancedQuery });
  }
  const isDisabledDelete = advancedQuery.id === id;

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {!isDisabledDelete && (
            <IconButton
              className={classes.button}
              aria-label="delete"
              onClick={handleDeleteCondition}
            >
              <DeleteIcon color="error" />
            </IconButton>
          )}

          <ToggleButtonGroup
            value={operator}
            onChange={handleOperatorToggle}
            exclusive
            style={{ height: "2rem" }}
          >
            <ToggleButton value="and" style={{ height: "2rem" }}>
              AND
            </ToggleButton>
            <ToggleButton value="or" style={{ height: "2rem" }}>
              OR
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleNewItem(id, "condition")}
          >
            <ControlPointIcon />
            Condition
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleNewItem(id, "group")}
          >
            <ControlPointIcon />
            Group
          </Button>
        </div>
      </div>
      <div style={{ paddingLeft: "2rem" }}>
        {items.map(item => {
          if (item.type === "group") {
            const { id, operator, items } = item;
            return (
              <QueryGroup key={id} id={id} operator={operator} items={items} />
            );
          } else {
            return (
              <QueryItem
                id={item.id}
                key={item.id}
                _key={item._key}
                keyOptions={item.keyOptions}
                value={item.value}
                valueOptions={item.valueOptions}
                relation={item.relation}
                relationOptions={item.relationOptions}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default QueryGroup;
