import React from "react";
import { makeStyles } from "@material-ui/core";
// import { ProjectContext } from "../../../context/Project.Context";
import { fade } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

// var debounceTimer = null;

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
    marginBottom: "1rem",
    width: "100%"
  }
}));

export default params => {
  // const { activeProject } = React.useContext(ProjectContext);
  const classes = useStyles();
  const [searchString, setSearchString] = React.useState("");

  // function onSearchStringChange(search_string) {
  //   const regex = search_string.split(/[\s,]+/).join("|");
  //   const query = {
  //     $and: [
  //       { project: activeProject },
  //       {
  //         "Record ID": { $regex: regex, $options: "i" }
  //       }
  //     ]
  //   };

  //   setSearchString(search_string);
  //   setSearchValue(query);

  //   clearTimeout(debounceTimer);
  //   debounceTimer = setTimeout(() => {
  //     fetchData(0, null, query);
  //   }, 1000);
  // }

  const handleSearchString = event => {
    setSearchString(event.target.value);
  };

  return (
    <div className={classes.search}>
      <IconButton aria-label="Search">
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
