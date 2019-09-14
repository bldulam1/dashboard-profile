const router = require("express").Router();
const { Scene, SearchFolder } = require("../schemas/scene");
const Path = require("path");
const Axios = require("axios");
const fs = require("fs");

const TEMPFOLDER = "./tmp/KPI";

router.get("/moshemoshe/all", async (req, res) => {
  const files = fs.readdirSync(TEMPFOLDER);
  res.send({ files });
});

router.get("/moshemoshe/one/:name", async (req, res) => {
  const file = Path.join(TEMPFOLDER, req.params.name);
  const obj = JSON.parse(fs.readFileSync(file, "utf8"));
  res.send(obj);
});

module.exports = router;
