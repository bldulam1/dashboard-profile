const router = require("express").Router();
const { Project, NamingConvention } = require("../schemas/naming");

router.get("/distinct/projects", async (req, res) => {
  const { key } = req.params;
  const uniqueKeys = await Project.distinct("name");
  res.send(uniqueKeys);
});

router.get("/distinct/:project/naming-convention", async (req, res) => {
  const { project } = req.params;
   const uniqueKeys = await Project.find({ name: project }).distinct(
    "namingConventions.name"
  );
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

router.post("/new-naming-convention", async (req, res) => {
  const namingConvention = new NamingConvention(req.body);
// console.log("req",req.body);

  const { _id, project, name } = namingConvention;
  const storingdata = await Promise.all([
    namingConvention.save(),
    Project.findOne({ name: project })
  ]);
// console.log(".........",_id,project,name);

  console.log("before push: ", JSON.stringify(storingdata), { name: project });

  storingdata[1].namingConventions.push({ id: _id, name });
  storingdata[1].namingConventions = [
    ...new Set(storingdata[1].namingConventions)
  ];
  await storingdata[1].save();
  res.send({ _id, name });
});

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const namingConvention = await NamingConvention.findByIdAndUpdate(
    id,
    { $set: req.body },
    function(err, result) {
      if (err) {
        console.log(err);
      }
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
