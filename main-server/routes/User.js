const router = require("express").Router();
const Client = require("../schemas/user");
const Project = require("../schemas/project");

function Role(roleLevel) {
  const roles = ["Guest", "Developer", "Team Leader", "Admin"];
  return { roleLevel, role: roles[roleLevel] };
}

router.post("/login/:name", async (req, res) => {
  const { email, name, online } = req.body;

  let user = await Client.findOneAndUpdate(
    { email },
    { online },
    { new: true }
  );
  if (!user) {
    let projects = await Project.find({}, { name: 1, _id: 0 });
    projects = projects.map(({ name }) => ({ name, ...Role(0) }));
    user = new Client({ email, name, projects, online });
    await user.save();
  }
  res.send(user);
});

module.exports = router;
