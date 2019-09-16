import React from "react";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "../../styles/classes";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
export default props => {
  const Map = ReactMapboxGl({
    accessToken:
      "pk.eyJ1IjoiYmxkdWxhbTEiLCJhIjoiY2p5YncwdHV2MGNuaDNjcW1mYnpxcnF5MiJ9._XwVCfgZCvePQBCvb-BUVA"
  });

  const classes = useStyles();
  return (
    <Paper className={classes.contentPaper}>
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "100%",
          width: "100%"
        }}
      >
        <Layer type="symbol" id="marker" layout={{ "icon-image": "marker-15" }}>
          <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
      </Map>
    </Paper>
  );
};
