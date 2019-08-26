import React, { useContext } from "react";
import { FileSearchContext } from "../../../../context/Search.Context";
import Button from "@material-ui/core/Button";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import QueryItem from "./QueryItem";

function QueryGroup(props) {
  const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  const { advancedQuery } = searchFileProps;
  const { id, operator, items } = props;

  const handleOperatorToggle = () => {
    let _advancedQuery = advancedQuery;

    const findDFS = (objects, id) => {
      for (let o of objects || []) {
        if (o.id === id) o.operator = o.operator === "and" ? "or" : "and";
        const o_ = findDFS(o.items, id);
        if (o_) o_.operator = o_.operator === "and" ? "or" : "and";
      }
    };

    findDFS([_advancedQuery], id);
    searchFileDispatch({
      advancedQuery: _advancedQuery
    });
  };

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
          <Button
            variant="contained"
            size="small"
            color={operator === "and" ? "primary" : "secondary"}
            onClick={handleOperatorToggle}
          >
            And
          </Button>
          <Button
            variant="contained"
            size="small"
            color={operator === "or" ? "primary" : "secondary"}
            onClick={handleOperatorToggle}
          >
            OR
          </Button>
        </div>

        <div>
          <Button variant="outlined" size="small">
            <ControlPointIcon />
            Item
          </Button>
          <Button variant="outlined" size="small">
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
