import React, { useState } from "react";
import SimpleSearch from "./SimpleSearch";
import TestCatalogFilters from "./TestCatalogFilters";
import FilterListIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

export default params => {
  const [filterOpen, setFilterOpen] = useState(false);
  const toggleFilter = () => setFilterOpen(!filterOpen);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}
    >
      <div style={{ width: "70%" }}>
        {filterOpen ? <TestCatalogFilters /> : <SimpleSearch />}
      </div>

      <Tooltip title="Filter list">
        <IconButton aria-label="filter list" onClick={toggleFilter}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};
