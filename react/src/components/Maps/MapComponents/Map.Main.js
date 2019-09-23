import React, { useContext } from "react";
import ReactMapboxGl, {
  GeoJSONLayer,
  Layer,
  Feature,
  Marker,
  MapContext
} from "react-mapbox-gl";
import { useTheme } from "@material-ui/styles";
import carMarker from "../../../assets/map-marker.svg";
import { MainMapContext } from "../../../context/MainMap.Context";
import uuid from "uuid/v4";

export default params => {
  const accessToken =
    "pk.eyJ1IjoiYmxkdWxhbTEiLCJhIjoiY2p5YncwdHV2MGNuaDNjcW1mYnpxcnF5MiJ9._XwVCfgZCvePQBCvb-BUVA";
  const linePaint = {
    "line-color": useTheme().palette.primary.main,
    "line-width": 5
  };

  // const { coordinates, center } = useContext(MainMapContext).state;
  const { coordinates, center } = useContext(MainMapContext).mapInfo;

  const Map = ReactMapboxGl({ accessToken });
  const geoJsonLine = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates
    }
  };
  const markers = [
    [139.656482, 35.510685],
    [139.657285, 35.510858],
    [139.657539, 35.510888],
    [139.658134, 35.510848],
    [139.658432, 35.510812],
    [139.658892, 35.510798],
    [139.659748, 35.510841],
    [139.660185, 35.510943],
    [139.660367, 35.510998],
    [139.660593, 35.511062],
    [139.660797, 35.511124],
    [139.66115, 35.511222],
    [139.66165, 35.511367],
    [139.662235, 35.51153],
    [139.662532, 35.51162],
    [139.662703, 35.5116],
    [139.663215, 35.511492],
    [139.663469, 35.511316],
    [139.664047, 35.510698],
    [139.664146, 35.510541],
    [139.664338, 35.510068],
    [139.665711, 35.50984],
    [139.666919, 35.51046],
    [139.667325, 35.51037],
    [139.668256, 35.51016],
    [139.668919, 35.510014],
    [139.66918, 35.509952],
    [139.671485, 35.50882]
  ];






 return (
    <Map
      id="map"
      zoom={[15]}
      onPitch={event => console.log(event.getPitch(), event.getBearing())}
      center={center}
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        height: "100%",
        width: "75%"
      }}
      valueLabelDisplay="off"
      onClick={event => console.log(event)}
    >
      <GeoJSONLayer data={geoJsonLine} linePaint={linePaint} />
      {markers.map(marker => {
        return (
          <Marker key={uuid()} coordinates={marker} anchor="bottom">
            <img src={carMarker} style={{ height: 50 }} />
          </Marker>
        );
      })}
      {/* <EnhancedMarker carLocation={carLocation}/> */}
    </Map>
  );
};
