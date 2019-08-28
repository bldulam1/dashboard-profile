const router = require("express").Router();
const { Scene } = require("../schemas/scene");
const { createSimsTasks } = require("./Task.SIMS");

router.post("/:operation/new", async (req, res) => {
  const { operation } = req.params;
  const files = await Scene.find(
    { _id: { $in: req.body.fileIDs } },
    { operations: 1, fileName: 1, path: 1, size: 1 }
  );
  switch (operation) {
    case "SIMS":
      const tasks = await createSimsTasks(req.body, files);
      return res.send(tasks);
    default:
      break;
  }
});

router.post("/:project/SIMS/check-validity", async (req, res) => {
  const { fileIDs } = req.body;
  const inValidFiles = await Scene.find(
    {
      _id: { $in: fileIDs },
      extension: { $ne: "cvw" }
    },
    { fileName: 1 }
  );
  res.send(inValidFiles);
});

module.exports = router;
