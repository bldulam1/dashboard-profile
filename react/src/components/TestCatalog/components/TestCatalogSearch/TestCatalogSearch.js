import React, { useState } from "react";
import SimpleSearch from "./SimpleSearch";
import TestCatalogFilters from "./TestCatalogFilters";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/styles";
// import { TextField, Slider } from "@material-ui/core";

const useStyle = makeStyles(theme => ({
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  filterContainer: {
    width: "60%"
  },
  filterIconContainer: {
    cursor: "pointer"
  }
}));

export default params => {
  const classes = useStyle();
  const [filterOpen, setFilterOpen] = useState(false);
  const toggleFilter = () => setFilterOpen(!filterOpen);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.filterContainer}>
        {filterOpen ? <TestCatalogFilters /> : <SimpleSearch />}
      </div>

      <Tooltip title="Filter list">
        <div className={classes.filterIconContainer} onClick={toggleFilter}>
          <FilterListIcon />
        </div>
      </Tooltip>
    </div>
  );
};
