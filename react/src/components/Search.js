import React from "react";
import axios from "axios";
import uuid from "uuid";
import Paper from "@material-ui/core/Paper";
import { fade, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import useToggle from "../hooks/useToggle";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  input: {
    flex: 1,
    marginLeft: 8,
    width: "90%"
  },
  iconButton: {
    marginLeft: 8,
    padding: 0
  },
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    height: "100%"
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

function SimpleSearch(props) {
  const classes = useStyles();
  const { searchValue, setSearchValue } = props;
  const [searchString, setSearchString] = React.useState("");

  function onSearchStringChange(search_string) {
    setSearchString(search_string);
    setSearchValue({
      name: search_string
    });
  }

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
}

function Relation(value, symbol) {
  return (
    <MenuItem key={uuid()} value={value}>
      {" "}
      {symbol}{" "}
    </MenuItem>
  );
}

function getRelations(type) {
  console.log(type);
  const numericRelations = [
    Relation("lte", "≤"),
    Relation("lt", "<"),
    Relation("e", "="),
    Relation("gt", ">"),
    Relation("gte", "≥"),
    Relation("ne", "≠")
  ];

  const stringRelations = [Relation("w", "with"), Relation("wo", "without")];
  return numericRelations;
}

function NewRule() {
  React.useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts").then(res => {
      setKeys(Object.keys(res.data[0]));
    });
  }, []);

  // const classes = useStyles();
  const [rule, setRule] = React.useState({
    key: "",
    relation: "",
    value: ""
  });

  const [keys, setKeys] = React.useState([]);
  const [selectedKey, setSelectedKey] = React.useState("");
  const [selectedKeyType, setSelectedKeyType] = React.useState(null);

  function onNewKey(key) {
    console.log(key);
    setSelectedKey(key);
    setRule({ ...rule, key });
  }

  return (
    <div>
      <FormControl style={{ width: "40%" }}>
        <InputLabel htmlFor="key-input">Key</InputLabel>
        <Select
          value={rule.key}
          onChange={event => onNewKey(event.target.value)}
          inputProps={{
            name: "key",
            id: "key-input"
          }}
        >
          {keys.map(key => (
            <MenuItem key={uuid()} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedKeyType && (
        <FormControl style={{ width: "20%" }}>
          <InputLabel htmlFor="rel-input">Relation</InputLabel>
          <Select
            value={rule.relation}
            onChange={event =>
              setRule({ ...rule, relation: event.target.value })
            }
            inputProps={{
              name: "rel",
              id: "rel-input"
            }}
          >
            {getRelations("string")}
          </Select>
        </FormControl>
      )}

      <FormControl style={{ width: "40%" }}>
        <InputLabel htmlFor="value-input">
          {" "}
          {rule.key.toUpperCase()}{" "}
        </InputLabel>
        <Select
          value={rule.key}
          onChange={event => setRule({ ...rule, value: event.target.value })}
          inputProps={{
            name: "value",
            id: "value-input"
          }}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function AdvancedSearch(props) {
  const classes = useStyles();
  return (
    <div>
      <NewRule />
    </div>
  );
}

function SearchBar() {
  const classes = useStyles();
  const [isAdvancedSearch, toggleAdvancedSearch] = useToggle(false);
  const [searchValue, setSearchValue] = React.useState("");

  async function search(event) {
    event.preventDefault();
    console.log(searchValue);
  }

  return (
    <Grid container spacing={1}>
      <Grid item md={9}>
        <form onSubmit={search}>
          {isAdvancedSearch ? (
            <AdvancedSearch />
          ) : (
            <SimpleSearch
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          )}
        </form>
      </Grid>
      <Grid item md={3}>
        <Button
          variant="contained"
          size="small"
          color={isAdvancedSearch ? "secondary" : "primary"}
          className={classes.button}
          onClick={toggleAdvancedSearch}
        >
          {isAdvancedSearch ? "simple" : "advanced"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default props => {
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then(res => setUsers(res.data));
  }, []);

  return (
    <Paper className={classes.contentPaper}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={9}>
          <SearchBar />
          <Grid item>
            {users.map(user => (
              <div key={uuid()}>
                <Typography gutterBottom variant="h5" component="h2">
                  {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </div>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Paper className={classes.paper}>xs=12 sm=6</Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};
