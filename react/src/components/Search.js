import React from "react";
import axios from "axios";
import uuid from "uuid";
import Paper from "@material-ui/core/Paper";
import { fade, makeStyles } from "@material-ui/core/styles";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";
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
import Typography from "@material-ui/core/Typography";

import AddCircleIcon from "@material-ui/icons/AddCircle";

import { api_server } from "../environment/environment";
import { ProjectContext } from "../context/Project.Context";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1
  },
  avatar: {
    margin: "0.25rem",
    backgroundColor: theme.palette.secondary.dark
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
    width: '100%'
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
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

function SimpleSearch(props) {
  const { activeProject } = React.useContext(ProjectContext);
  const classes = useStyles();
  const { setSearchValue } = props;
  const [searchString, setSearchString] = React.useState("");

  function onSearchStringChange(search_string) {
    const regex = search_string.split(/[\s,]+/).join("|");
    const query = {
      $and: [
        { project: activeProject },
        {
          $or: [
            "path",
            "parentFolder",
            "fileName",
            "extension",
            "tags.values"
          ].map(field => ({ [`${field}`]: { $regex: regex, $options: "i" } }))
        }
      ]
    };

    setSearchString(search_string);
    setSearchValue(query);
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
  const [keys, setKeys] = React.useState([]);
  const [keyOptions, setKeyOptions] = React.useState([]);
  const [selectedKey, setSelectedKey] = React.useState("");

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

  async function onNewKey(key, activeProject) {
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
          label={rule.key ? rule.key.toLocaleUpperCase() : "Value"}
          value={rule.value}
          onChange={event => setRule({ ...rule, value: event.target.value })}
          style={{ width: "50%" }}
        />
      )}
    </div>
  );
}

function NewGroup() {
  const [logic, toggleLogic] = useToggle(false);

  return (
    <div>
      <div>
        <ButtonGroup
          variant="contained"
          color="primary"
          size="small"
          aria-label="Small contained button group"
        >
          <Button size="small" onClick={toggleLogic} style={{ width: "5rem" }}>
            {logic ? "and" : "or"}
          </Button>
          <Button>
            <AddCircleIcon /> rule
          </Button>
          <Button>
            <AddCircleIcon /> group
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

function AdvancedSearch(props) {
  return (
    <div>
      <NewGroup />
      <NewRule />
    </div>
  );
}

function SearchBar(props) {
  const { skip, limit, setScenes } = props;
  const classes = useStyles();
  const { activeProject } = React.useContext(ProjectContext);
  const [isAdvancedSearch, toggleAdvancedSearch] = useToggle(false);
  const [searchValue, setSearchValue] = React.useState("");

  async function search(event) {
    event.preventDefault();
    const searchValueString = JSON.stringify(searchValue);
    axios
      .get(
        `${api_server}/search/${activeProject}/${skip}/${limit}/${searchValueString}`
      )
      .then(res => {
        console.log(res.data);
        setScenes(res.data.scenes);
      });
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

function normalizeSize(byteSize) {
  const units = " KMGTPEZYXSD";
  let newSize = byteSize;
  let index = 0;
  while (newSize > 1000) {
    newSize /= 1000;
    index++;
  }
  return `${newSize.toFixed(2)} ${units[index]}B`;
}
function SceneList(props) {
  const { scenes } = props;
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List dense className={classes.list}>
      {scenes.map(scene => {
        const labelId = uuid();
        return (
          <ListItem key={scene._id}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                {scene.extension[0].toLocaleUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id={labelId}
              primary={
                <React.Fragment>
                  <Typography component="span" variant="h6" color="textPrimary">
                    {scene.fileName}
                  </Typography>
                </React.Fragment>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    component="div"
                    variant="caption"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    <b style={{ marginRight: "0.5rem" }}>Path</b>
                    {scene.path}
                  </Typography>
                  <Typography
                    component="div"
                    variant="caption"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    <b style={{ marginRight: "0.5rem" }}>Size</b>
                    {normalizeSize(scene.size)}
                  </Typography>
                  {/* <Typography
                    component="div"
                    variant="caption"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    <b style={{ marginRight: "0.5rem" }}>Date</b>
                    {scene.date}
                  </Typography> */}
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                color="primary"
                onChange={handleToggle(scene)}
                checked={checked.indexOf(scene) !== -1}
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

export default props => {
  const classes = useStyles();
  const [scenes, setScenes] = React.useState([]);
  const [isLoading, setIsLoading] = useToggle(false);

  return (
    <Paper className={classes.contentPaper}>
      <Grid container spacing={1}>
        <Grid item md={12} lg={9}>
          <SearchBar skip={0} limit={10} setScenes={setScenes} />
          <Grid item>
            <SceneList scenes={scenes} />
          </Grid>
        </Grid>
        <Grid item md={12} lg={3}>
          <Paper className={classes.paper}>xs=12 sm=6</Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};
