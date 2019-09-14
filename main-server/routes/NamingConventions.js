const router = require("express").Router();
const NamingConvention = require("../schemas/naming");
const Project = require("../schemas/project");

router.get("/distinct/projects", async (req, res) => {
  const { key } = req.params;
  const uniqueKeys = await Project.distinct("name");
  res.send(uniqueKeys);
});

router.get("/distinct/:project/names", async (req, res) => {
  const { project } = req.params;
  const uniqueKeys = await NamingConvention.find({ project }, { name: 1 });
  res.send(uniqueKeys);
});

router.get("/distinct/:project/naming-convention/:ncName", async (req, res) => {
  const { project, ncName } = req.params;
  const uniqueKeys = await Project.find(
    { name: project, "namingConventions.name": ncName },
    {
      _id: 0,
      name: { $elemMatch: { name: ncName } }
    }
  );
  res.send(uniqueKeys);
});

router.get("/contents/:id", async (req, res) => {
  const { id } = req.params;
  const nc = await NamingConvention.findById(id);
  res.send(nc);
});

router.post("/new", async (req, res) => {
  const namingConvention = new NamingConvention(req.body);
  const { _id, project, name } = namingConvention;
  await namingConvention.save();
  res.send({ _id, project, name });
});

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const namingConvention = await NamingConvention.findByIdAndUpdate(
    id,
    { $set: req.body },
    function(err, result) {
      if (err) console.log(err);
    }
  );

  if (namingConvention) {
    let { patternElements } = namingConvention;
    console.log("Updated Patern Elements: ", patternElements);
  }

  res.send(namingConvention);
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const namingConvention = await Promise.all([
    NamingConvention.findByIdAndDelete(id),
    Project.update(
      {},
      { $pull: { namingConventions: { id: id } } },
      { multi: true }
    )
  ]);

  if (namingConvention) {
    console.log("Removed Naming convention: ");
  }

  res.send("Delete Successfull");
});

router.post("/new-project", async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.send(project);
});

module.exports = router;
