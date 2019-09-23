import { createContext } from "react";

export const MainMapContext = createContext({
  mapInfo: {
    inputFile: "V:/JP01/DataLake/Common_Write/Subaru_DC/20190626_141439_FCR_SBR_AD2_R0500D512_DC_JSOIMPREZA/cache/20190626_141439_FCR_SBR_AD2_R0500D512_DC_JSOIMPREZA_split_F1.kml",
    coordinates: [[-122.48369693756104, 37.83381888486939]],
    center: [-122.48369693756104, 37.83381888486939],
  },
  mapControl: {

  },
  setMapControl: null,

  setMapInfo: null
});
