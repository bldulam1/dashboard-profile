import React from "react";
import Paper from "@material-ui/core/Paper";
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import { makeStyles, withStyles, useTheme } from "@material-ui/styles";
import { Slider } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paper: {
    width: "100%",
    borderLeft: "1px white solid",
    overflow: "auto"
  },
  leftSideBar: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 348,
    width: "15%",
    background: "#313131",
    borderRight: "1px white solid",
    alignItems: "center",
    color: theme.palette.primary.contrastText
  },
  row1: {
    display: "flex",
    flexDirection: "row",
    height: "85%"
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
    maxWidth: 348,
    width: "15%",
    background: "#313131",
    borderTop: "1px white solid",
    borderRight: "1px white solid",
    justifyContent: "center",
    alignItems: "center"
  },
  scroll: {
    display: "flex",
    flexDirection: "column",
    width: "85%",
    background: "#313131",
    borderTop: "1px white solid",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.primary.contrastText
  },
  slider: { color: theme.palette.secondary.main, width: "95%" }
}));

export default props => {
  const accessToken =
    "pk.eyJ1IjoiYmxkdWxhbTEiLCJhIjoiY2p5YncwdHV2MGNuaDNjcW1mYnpxcnF5MiJ9._XwVCfgZCvePQBCvb-BUVA";
  const [state, setState] = React.useState({
    center: [-122.48695850372314, 37.82931081282506],
    coordinates: [[-122.48369693756104, 37.83381888486939]]
  });

  const Map = ReactMapboxGl({ accessToken });
  const geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: state.coordinates
    }
  };

  React.useEffect(() => {
    Axios.get(
      `${api_server}/maps/parse-kml/1/kml=V:/JP01/DataLake/Common_Write/Subaru_DC/20190626_141439_FCR_SBR_AD2_R0500D512_DC_JSOIMPREZA/cache/20190626_141439_FCR_SBR_AD2_R0500D512_DC_JSOIMPREZA_split_F1.kml`
    ).then(results => {
      if (results.data.center && results.data.coordinates) {
        const pointsText = results.data.coordinates
          .slice(0, 3)
          .map(point => `${point[0]},${point[1]}`)
          .join(";");
        Axios.get(
          `https://api.mapbox.com/matching/v5/mapbox/driving/${pointsText}?access_token=${accessToken}`
        ).then(results => {
          console.log(results.data);
        });

        console.log(results.data.distance);
        setState({
          center: results.data.center,
          coordinates: results.data.coordinates
        });
      }
    });
  }, []);

  const linePaint = {
    "line-color": useTheme().palette.primary.main,
    "line-width": 5
  };

  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <div className={classes.row1}>
        <div className={classes.leftSideBar}>Left Sidebar</div>
        <Map
          zoom={[15]}
          onPitch={event => console.log(event.getPitch(), event.getBearing())}
          center={state.center}
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100%",
            width: "85%"
          }}
        >
          <GeoJSONLayer data={geojson} linePaint={linePaint} />
        </Map>
      </div>
      <div className={classes.row2}>
        <div className={classes.dashboard}>Dashboard</div>
        <div className={classes.scroll}>
          <PrettoSlider
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            defaultValue={20}
          />
        </div>
      </div>
    </div>
  );
};

const PrettoSlider = withStyles(theme => ({
  root: {
    color: theme.palette.secondary.main,
    height: 8,
    margin: theme.spacing
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
