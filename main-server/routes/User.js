const router = require("express").Router();
const { Scene, SearchFolder } = require("../schemas/scene");
const User = require("../schemas/user");
const Project = require("../schemas/project");
// const Project = require("../schemas/project");
const { existsSync } = require("fs");
const readdirp = require("readdirp");
const path = require("path");
const Axios = require("axios");

function Role(roleLevel) {
  const roles = ["Guest", "Developer", "Team Leader", "Admin"];
  return { roleLevel, role: roles[roleLevel] };
}

router.post("/login/:name", async (req, res) => {
  const { email, name } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    let projects = await Project.find({}, { name: 1, _id: 0 });
    projects = projects.map(({ name }) => ({ name, ...Role(0) }));
    user = new User({ email, name, projects });
    await user.save();
  }
  res.send(user);
});

module.exports = router;
