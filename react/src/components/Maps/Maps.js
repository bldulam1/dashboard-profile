import React, { useContext, useReducer, useState } from "react";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import { makeStyles, withStyles, useTheme } from "@material-ui/styles";
import {
  Slider,
  TextField,
  Tabs,
  Tab,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import uuid from "uuid/v4";
import { MainMapContext } from "../../context/MainMap.Context";
import ReactMapboxGl, {
  GeoJSONLayer,
  Marker,
  MapContext
} from "react-mapbox-gl";
import carMarker from "../../assets/map-marker.svg";

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

const EnhancedMarker = props => {
  const { carLocation } = props;
  return (
    <Marker coordinates={carLocation} anchor="bottom">
      <img src={carMarker} style={{ height: 50 }} />
    </Marker>
  );
};

function reducer(state, action) {
  return action;
}

let previousID = null;

export default props => {
  const [state, dispatch] = useReducer(reducer, {
    inputFile:
      "V:/JP01/DataLake/Common_Write/Subaru_DC/20190626_141439_FCR_SBR_AD2_R0500D512_DC_JSOIMPREZA/cache/20190626_141439_FCR_SBR_AD2_R0500D512_DC_JSOIMPREZA_split_F1.kml",
    coordinates: [[0, 0]],
    center: [0, 0],
    distance: 0,
    carLocation: [0, 0],
    markers: []
  });

  const { inputFile, coordinates, markers } = state;

  React.useEffect(() => {
    Axios.get(`${api_server}/maps/parse-kml/1/kml=${inputFile}`).then(
      results => {
        if (results.data.center && results.data.coordinates) {
          dispatch(results.data);
          console.log(results.data);
        }
      }
    );
  }, [inputFile]);

  const handleChange = name => event => {
    // dispatch({ [name]: event.target.value });
  };
  const accessToken =
    "pk.eyJ1IjoiYmxkdWxhbTEiLCJhIjoiY2p5YncwdHV2MGNuaDNjcW1mYnpxcnF5MiJ9._XwVCfgZCvePQBCvb-BUVA";

  const Map = ReactMapboxGl({ accessToken });
  const classes = useStyles();
  let mapHandler = null;

  return (
    <div className={classes.paper}>
      <MainMapContext.Provider value={{ state, dispatch }}>
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
          {coordinates.length > 1 && (
            <Map
              onStyleLoad={map => {
                mapHandler = map;
              }}
              id="map"
              zoom={[15]}
              onPitch={event =>
                console.log(event.getPitch(), event.getBearing())
              }
              center={state.center}
              style="mapbox://styles/mapbox/streets-v9"
              containerStyle={{
                height: "100%",
                width: "75%"
              }}
              valueLabelDisplay="off"
              onClick={event => console.log(event)}
            >
              <MapContext.Consumer>
                {map => {
                  map.addLayer({
                    id: "route",
                    type: "line",
                    source: {
                      type: "geojson",
                      data: {
                        type: "Feature",
                        properties: {},
                        geometry: {
                          type: "LineString",
                          coordinates
                        }
                      }
                    },
                    layout: {
                      "line-join": "round",
                      "line-cap": "round"
                    },
                    paint: {
                      "line-color": "#303030",
                      "line-width": 8
                    }
                  });
                }}
              </MapContext.Consumer>
            </Map>
          )}
        </div>
        <div className={classes.row2}>
          <div className={classes.dashboard}>Dashboard</div>
          <div className={classes.scroll}>
            <FormControlLabel
              control={
                <Switch
                  checked={state.jason}
                  onChange={handleChange("jason")}
                  value="jason"
                />
              }
              label="Snap"
            />
            <CustomSlider
              key={uuid()}
              onChangeCommitted={(event, value) => {
                if (previousID) mapHandler.removeLayer(previousID);
                previousID = uuid();
                mapHandler.flyTo(flyToOptions(coordinates[value]));
                mapHandler.addLayer(FlyToMarker(coordinates[value]));
              }}
              valueLabelDisplay="off"
              aria-label="pretto slider"
              defaultValue={0}
              min={0}
              max={coordinates.length - 1}
              step={null}
              marks={markers}
            />
          </div>
        </div>
      </MainMapContext.Provider>
    </div>
  );
};

const flyToOptions = center => ({
  center,
  zoom: 20,
  speed: 5,
  curve: 1,
  easing: t => t
});

const FlyToMarker = coordinates => ({
  id: previousID,
  type: "symbol",
  source: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates
          },
          properties: {
            title: "Current Position",
            icon: "car",
            "icon-size": 0.25
          }
        }
      ]
    }
  },
  layout: {
    "icon-image": "{icon}-15",
    "text-field": "{title}",
    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    "text-offset": [0, 0.6],
    "text-anchor": "top"
  }
});

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const CustomSlider = withStyles(theme => ({
  root: {
    color: "#3880ff",
    height: 2,
    padding: "15px 0"
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: "#fff",
    boxShadow: iOSBoxShadow,
    marginTop: -14,
    marginLeft: -14,
    "&:focus,&:hover,&$active": {
      boxShadow:
        "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      "@media (hover: none)": {
        boxShadow: iOSBoxShadow
      }
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 11px)",
    top: -22,
    "& *": {
      background: "transparent",
      color: "#000"
    }
  },
  track: {
    height: 2
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: "#bfbfbf"
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    marginTop: -3
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor"
  }
}))(Slider);
