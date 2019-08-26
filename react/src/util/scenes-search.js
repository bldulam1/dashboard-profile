import { api_server } from "../environment/environment";
import Axios from "axios";

export function fetchScenesData(
  { project, skip, limit, query, sort },
  callback
) {
  // const skip = page * rowsPerPage;
  const searchValueString = JSON.stringify(query);
  const sortString = JSON.stringify(sort);
  const scenesURL = `${api_server}/search/${project}/skip=${skip}/limit=${limit}/sort=${sortString}/query=${searchValueString}`;
  Axios.get(scenesURL).then(res => {
    callback({
      count: res.data.count,
      scenes: res.data.scenes,
      focusScene: res.data.scenes.length ? res.data.scenes[0]._id : null
    });
  });
}
