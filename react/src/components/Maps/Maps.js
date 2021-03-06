import React from "react";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "../../styles/classes";
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import Axios from "axios";
import { api_server } from "../../environment/environment";
export default props => {
  const [state, setState] = React.useState({
    center: [-122.48695850372314, 37.82931081282506],
    coordinates: [[-122.48369693756104, 37.83381888486939]]
  });

  const Map = ReactMapboxGl({
    accessToken:
      "pk.eyJ1IjoiYmxkdWxhbTEiLCJhIjoiY2p5YncwdHV2MGNuaDNjcW1mYnpxcnF5MiJ9._XwVCfgZCvePQBCvb-BUVA"
  });
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
      `${api_server}/maps/parse-kml/1/kml=V:\\JP01\\DataLake\\Common_Write\\Subaru_DC\\20190130_174854_FCR_SBR_AD1_R04_DC_JSOIMPREZA\\cache\\20190130_174854_FCR_SBR_AD1_R04_DC_JSOIMPREZA_split_F1.kml`
    ).then(results => {
      if (results.data.center && results.data.coordinates) {
        console.log(results.data.distance);
        setState({
          center: results.data.center,
          coordinates: results.data.coordinates
        });
      }
    });
  }, []);

  const linePaint = {
    "line-color": "blue",
    "line-width": 5
  };

  const classes = useStyles();
  return (
    <Paper className={classes.contentPaper}>
      <Map
        zoom={[15]}
        center={state.center}
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
      >
        <GeoJSONLayer data={geojson} linePaint={linePaint} />
      </Map>
    </Paper>
  );
};
