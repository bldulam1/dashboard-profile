import React, { useContext } from "react";
import { FileSearchContext } from "../../../context/Search.Context";
import QueryGroup from "./Advanced/QueryGroup";


export default props => {
  const { searchFileProps } = useContext(FileSearchContext);
  const { id, operator, items } = searchFileProps.advancedQuery;

  return <QueryGroup id={id} operator={operator} items={items} />;
};
