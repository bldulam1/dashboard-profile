const router = require("express").Router();
const Project = require("../schemas/project");
// const { Scene, SearchFolder } = require("../schemas/scene");
// const Worker = require("../schemas/worker");
// const { existsSync } = require("fs");
// const readdirp = require("readdirp");
// const path = require("path");
// const Axios = require("axios");

router.get("/all", async (req, res) => {
  res.send(await Project.find({}));
});

module.exports = router;
