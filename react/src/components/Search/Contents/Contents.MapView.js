import React from "react";
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import Axios from "axios";
import { api_server } from "../../../environment/environment";
export default props => {
  const { kmlFile } = props;
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
    console.log("loading");
    Axios.get(`${api_server}/maps/parse-kml/1/kml=${kmlFile}`).then(results => {
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

  return (
    <Map
      zoom={[15]}
      center={state.center}
      containerStyle={{
        height: "100%",
        width: "100%"
      }}
    >
      <GeoJSONLayer data={geojson} linePaint={linePaint} />
    </Map>
  );
};
