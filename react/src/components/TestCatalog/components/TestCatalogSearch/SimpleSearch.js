import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import { fetchData } from "../../../../util/test-catalog";

var debounceTimer = null;
const TIMER = 500;

const useStyles = makeStyles(theme => ({
  search: {
    display: "flex",
    flexDirection: "row",
    verticalAlign: "middle",
    position: "relative",

    border: `0.05rem solid ${theme.palette.primary.main}`,
    borderRadius: "2rem",
    "&:hover": {
      backgroundColor: fade("#707070", 0.1)
    },
    marginLeft: 0,
    // marginBottom: "1rem",
    width: "100%"
  }
}));

export default params => {
  const classes = useStyles();
  const { tcProps, tcDispatch } = useContext(TestCatalogContext);
  const [searchString, setSearchString] = React.useState("");

  const handleSearchString = event => {
    const newSearchString = event.target.value;
    const newQuery = {
      "Record ID": { $regex: newSearchString, $options: "i" }
    };
    setSearchString(newSearchString);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchData({ ...tcProps, query: newQuery }, res =>
        tcDispatch({ ...res, query: newQuery })
      );
    }, TIMER);
  };

  return (
    <div className={classes.search}>
      <IconButton aria-label="Search" style={{ padding: "0.25rem" }}>
        <SearchIcon color="primary" aria-label="Search" />
      </IconButton>
      <InputBase
        placeholder="Search"
        inputProps={{ "aria-label": "Search" }}
        value={searchString}
        fullWidth
        onChange={handleSearchString}
      />
    </div>
  );
};
