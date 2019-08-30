const router = require("express").Router();
const { Scene, SearchFolder } = require("../schemas/scene");
const User = require("../schemas/user");
// const Project = require("../schemas/project");
const { existsSync } = require("fs");
const readdirp = require("readdirp");
const path = require("path");
const Axios = require("axios");

router.post("/login/:name", async (req, res) => {
  const { email, name } = req.body;
  const projects = [];

  const user = await User.findOneAndUpdate(
    { email, name },
    { email, name, online: true, projects },
    { new: true, upsert: true }
  );
  res.send(user);
});

module.exports = router;
