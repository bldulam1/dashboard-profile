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
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { api_server } from "../environment/environment";
import { ProjectContext } from "../context/Project.Context";
import { TextField } from "@material-ui/core";

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
      {symbol}
    </MenuItem>
  );
}

function getRelations(selectedKey) {
  const numericRelations = [
    Relation("lte", "≤"),
    Relation("lt", "<"),
    Relation("gt", ">"),
    Relation("gte", "≥")
  ];

  const stringRelations = [Relation("w", "with"), Relation("wo", "without")];
  const fixedRelations = [Relation("e", "="), Relation("ne", "≠")];

  if (
    ["extension", "parentFolder"].includes(selectedKey) ||
    selectedKey.includes("tags")
  ) {
    return fixedRelations;
  } else if (["path", "fileName"].includes(selectedKey)) {
    return [...stringRelations, ...fixedRelations];
  } else if (selectedKey.includes("date") || selectedKey.includes("size")) {
    return [...fixedRelations, ...numericRelations];
  } else {
    return [...fixedRelations, ...numericRelations, ...fixedRelations];
  }
}

function NewRule(props) {
  const { activeProject } = React.useContext(ProjectContext);

  React.useEffect(() => {
    axios.get(`${api_server}/search/${activeProject}/unique/tags`).then(res => {
      setKeys(res.data);
    });
  }, []);

  // const classes = useStyles();
  const [rule, setRule] = React.useState({
    key: "",
    relation: "",
    value: ""
  });

  const [keys, setKeys] = React.useState([]);
  const [keyOptions, setKeyOptions] = React.useState([]);
  const [selectedKey, setSelectedKey] = React.useState("");

  async function onNewKey(key, activeProject) {
    console.log(key);
    setSelectedKey(key);
    setRule({ ...rule, key });

    axios
      .get(`${api_server}/search/${activeProject}/unique/tag/${key}`)
      .then(res => {
        const count = res.data.length;
        if (count > 0 && count < 50) {
          setKeyOptions(res.data);
        }
      });
  }

  return (
    <div>
      <FormControl style={{ width: "30%" }}>
        <InputLabel htmlFor="key-input">Key</InputLabel>
        <Select
          value={rule.key}
          onChange={event => onNewKey(event.target.value, activeProject)}
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

      <FormControl style={{ width: "20%" }}>
        <InputLabel htmlFor="rel-input">Relation</InputLabel>
        <Select
          value={rule.relation}
          onChange={event => setRule({ ...rule, relation: event.target.value })}
          inputProps={{
            name: "rel",
            id: "rel-input"
          }}
        >
          {getRelations(selectedKey)}
        </Select>
      </FormControl>

      {keyOptions.length ? (
        <FormControl style={{ width: "50%" }}>
          <InputLabel htmlFor="value-input">
            {rule.key.toLocaleUpperCase()}
          </InputLabel>
          <Select
            value={rule.value}
            onChange={event => setRule({ ...rule, value: event.target.value })}
            inputProps={{
              name: "value",
              id: "value-input"
            }}
          >
            {keyOptions.map(keyOption => (
              <MenuItem key={uuid()} value={keyOption}>
                {keyOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          id="standard-name"
          label={rule.key ? rule.key.toLocaleUpperCase() : 'Value'}
          value={rule.value}
          onChange={event => setRule({ ...rule, value: event.target.value })}
          style={{width: '50%'}}
        />
      )}
    </div>
  );
}

function AdvancedSearch(props) {
  return (
    <div>
      <NewRule />
    </div>
  );
}

function SearchBar(props) {
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

  return (
    <Paper className={classes.contentPaper}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={9}>
          <SearchBar />
          <Grid item>
            {/* {users.map(user => (
              <div key={uuid()}>
                <Typography gutterBottom variant="h5" component="h2">
                  {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </div>
            ))} */}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Paper className={classes.paper}>xs=12 sm=6</Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};
