import React, { useContext, useReducer, useState } from "react";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import { makeStyles, withStyles, useTheme } from "@material-ui/styles";
import { Slider, TextField, Tabs, Tab } from "@material-ui/core";
import MapMain from "./MapComponents/Map.Main";
import { MainMapContext } from "../../context/MainMap.Context";

const useStyles = makeStyles(theme => ({
  paper: {
    width: "100%",
    borderLeft: "1px white solid",
    overflow: "auto"
  },
  row1: {
    display: "flex",
    flexDirection: "row",
    height: "85%"
  },
  leftSideBar: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    width: "25%",
    // background: "#FFFFFF",
    borderRight: "1px white solid",
    alignItems: "center",
    color: theme.palette.primary.contrastText
  },

  row2: {
    display: "flex",
    flexDirection: "row",
    height: "15%",
    background: "#313131"
  },
  dashboard: {
    display: "flex",
    flexDirection: "column",
    width: "25%",
    background: "#313131",
    borderTop: "1px white solid",
    borderRight: "1px white solid",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.primary.contrastText
  },
  scroll: {
    display: "flex",
    flexDirection: "column",
    width: "75%",
    background: "#313131",
    borderTop: "1px white solid",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2)
  },
  slider: { color: theme.palette.secondary.main, width: "95%" },
  form: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap"
  },
  notchedOutline: {
    borderColor: "white",
    borderWidth: 1,
    "&:hover": {
      borderColor: "white",
      borderWidth: 2
    }
  }
}));

// const EnhancedMarker = props => {
//   const { carLocation } = props;
//   return (
//     <Marker coordinates={carLocation} anchor="bottom">
//       <img src={carMarker} style={{ height: 50 }} />
//     </Marker>
//   );
// };

function reducer(state, action) {
  return { ...state, ...action };
}

export default props => {
  const [mapInfo, setMapInfo] = useState({
    inputFile:
      "V:/JP01/DataLake/Common_Write/Subaru_DC/20190626_141439_FCR_SBR_AD2_R0500D512_DC_JSOIMPREZA/cache/20190626_141439_FCR_SBR_AD2_R0500D512_DC_JSOIMPREZA_split_F1.kml",
    coordinates: [[0, 0]],
    center: [0, 0],
    distance: 0,
  });
  const { inputFile, coordinates } = mapInfo;

  const [mapControl, setMapControl] = useState({
    currentFrame: [],
  })


  React.useEffect(() => {
    Axios.get(`${api_server}/maps/parse-kml/1/kml=${inputFile}`).then(
      results => {
        if (results.data.center && results.data.coordinates) {
          setMapInfo(results.data);
        }
      }
    );
  }, [inputFile]);

  const handleChange = name => event => {
    // dispatch({ [name]: event.target.value });
  };

  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <MainMapContext.Provider value={{ mapInfo, setMapInfo }}>
        <div className={classes.row1}>
          <div className={classes.leftSideBar}>
            <form
              className={classes.form}
              noValidate
              autoComplete="off"
              onSubmit={event => event.preventDefault()}
            >
              <TextField
                id="inputFile-flexible"
                label="Input File"
                multiline
                rowsMax="2"
                value={inputFile}
                onChange={handleChange("fileName")}
                margin="none"
                fullWidth
                variant="outlined"
                InputProps={{
                  classes: {
                    notchedOutline: classes.notchedOutline
                  }
                }}
              />
            </form>
            <Tabs
              onChange={handleChange}
              value={0}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="streams charts tab"
            >
              <Tab label="STREAMS" />
              <Tab label="CHARTS" />
            </Tabs>
          </div>
          {coordinates.length > 1 && <MapMain />}
        </div>
        <div className={classes.row2}>
          <div className={classes.dashboard}>Dashboard</div>
          <div className={classes.scroll}>
            <PrettoSlider
              onChangeCommitted={(event, value) => {
                // setCarLocation(coordinates[value]);
              }}
              valueLabelDisplay="off"
              aria-label="pretto slider"
              defaultValue={0}
              min={0}
              max={coordinates.length - 1}
              step={1}
            />
          </div>
        </div>
      </MainMapContext.Provider>
    </div>
  );
};

const PrettoSlider = withStyles(theme => ({
  root: {
    color: theme.palette.secondary.main,
    height: 8
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus,&:hover,&$active": {
      boxShadow: "inherit"
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)"
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
}))(Slider);
