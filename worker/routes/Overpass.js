const router = require("express").Router();
const axios = require("axios");

function interfaceOverpassAPI(query) {
  return new Promise((resolve, reject) => {
    const api = `https://www.overpass-api.de/api/interpreter?data=${query}`;
    axios
      .get(api)
      .then(({ data }) => resolve(data))
      .catch(() => reject(null));
  });
}

router.get("/:query", async (req, res) => {
  const { query } = req.params;
  // const api = `https://www.overpass-api.de/api/interpreter?data=${query}`;
  // axios
  //   .get(api)
  //   .then(({ data }) => res.send(data))
  //   .catch(() => res.send({}));

  let tries = 5;
  let returnValue = null;
  while (tries > 0) {
    const response = await interfaceOverpassAPI(query);
    if (response) {
      returnValue = response;
      break;
    }
    tries--;
  }

  res.send(returnValue);
});

module.exports = router;
