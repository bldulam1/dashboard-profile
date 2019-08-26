import React, { useState } from "react";
import QuerybarSimpleSearch from "./Querybar.SimpleSearch";
import QuerybarAdvancedSearch from "./Querybar.AdvancedSearch";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
const useStyles = makeStyles(theme => ({
  pb1: {
    paddingBottom: "1rem"
  }
}));
export default params => {
  const { pb1 } = useStyles();
  const [searchType, setSearchType] = useState("advanced");
  const handleSearchTypeClick = () => {
    setSearchType(searchType === "simple" ? "advanced" : "simple");
  };

  return (
    <div className={pb1}>
      <Button
        disableRipple
        color="primary"
        size="small"
        onClick={handleSearchTypeClick}
      >
        {searchType}
      </Button>
      {searchType === "simple" ? (
        <QuerybarAdvancedSearch />
      ) : (
        <QuerybarSimpleSearch />
      )}
    </div>
  );
};
