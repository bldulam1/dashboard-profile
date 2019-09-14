const router = require("express").Router();
const Project = require("../schemas/project");

router.get("/all", async (req, res) => {
  res.send(await Project.find({}));
});

module.exports = router;
