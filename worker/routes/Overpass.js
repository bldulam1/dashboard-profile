const router = require("express").Router();
const { Scene, SearchFolder } = require("../../main-server/schemas/scene");
const axios = require("axios");

router.get("/:query", async (req, res) => {
  const { query } = req.params;
  const api = `https://www.overpass-api.de/api/interpreter?data=${query}`;
  axios
    .get(api)
    .then(({ data }) => res.send(data))
    .catch(() => res.send({}));
});

module.exports = router;
