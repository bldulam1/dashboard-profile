import React, { useContext } from "react";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { ProjectContext } from "../../../context/Project.Context";
import { makeStyles } from "@material-ui/styles";
import { fade } from "@material-ui/core/styles";
import { FileSearchContext } from "../../../context/Search.Context";

const useStyles = makeStyles(theme => ({
  input: {
    flex: 1,
    marginLeft: 8,
    width: "90%"
  },
  iconButton: {
    marginLeft: 8,
    padding: 0
  },
  search: {
    verticalAlign: "middle",
    position: "relative",

    border: `0.05rem solid ${theme.palette.primary.main}`,
    borderRadius: "2rem",
    "&:hover": {
      backgroundColor: fade("#707070", 0.1)
    },
    marginLeft: 0,
    width: "100%"
  }
}));

let debounceTimer = null;
export default props => {
  const classes = useStyles();
  const [searchString, setSearchString] = React.useState("");

  const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  const { project } = searchFileProps;

  const onSearchStringChange = search_string => {
    setSearchString(search_string);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const regex = search_string.split(/[\s,]+/).join("|");
      const query = {
        $and: [
          { project },
          {
            $or: ["path", "parentFolder", "fileName", "extension"].map(
              field => ({
                [`${field}`]: { $regex: regex, $options: "i" }
              })
            )
          }
        ]
      };
      searchFileDispatch({ query });
    }, 500);
  };

  return (
    <div className={classes.search}>
      <IconButton className={classes.iconButton} aria-label="Search">
        <SearchIcon color="primary" aria-label="Search" />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "Search" }}
        value={searchString}
        onChange={event => onSearchStringChange(event.target.value)}
      />
    </div>
  );
};
