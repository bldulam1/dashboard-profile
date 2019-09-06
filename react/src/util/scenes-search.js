import { api_server } from "../environment/environment";
import Axios from "axios";

export function fetchScenesData(
  { project, skip, limit, query, sort },
  callback
) {
  const scenesURL = `${api_server}/search/${project}/fetch-scenes`;
  const body = { skip, limit, query, sort };
  Axios.post(scenesURL, body).then(res => {
    callback({
      count: res.data.count,
      scenes: res.data.scenes,
      focusScene: res.data.scenes.length ? res.data.scenes[0]._id : null
    });
  });
}
