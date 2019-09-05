import React, { useState } from "react";
import QuerybarSimpleSearch from "./Querybar.SimpleSearch";
import QuerybarAdvancedSearch from "./Querybar.AdvancedSearch";
import { makeStyles } from "@material-ui/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
const useStyles = makeStyles(theme => ({
  mb1: {
    marginBottom: "1rem"
  }
}));
export default params => {
  const { mb1 } = useStyles();
  const [searchType, setSearchType] = useState("simple");
  const handleSearchTypeClick = (event, newValue) => {
    setSearchType(newValue);
  };

  return (
    <div className={mb1}>
      <Tabs
        value={searchType}
        onChange={handleSearchTypeClick}
        indicatorColor="primary"
        textColor="primary"
        centered
        className={mb1}
      >
        <Tab value="simple" label="Simple Search" />
        <Tab value="advanced" label="Advanced Search" />
      </Tabs>
      <div hidden={searchType !== "simple"}>
        <QuerybarSimpleSearch />
      </div>
      <div hidden={searchType === "simple"}>
        <QuerybarAdvancedSearch />
      </div>
    </div>
  );
};
