const router = require("express").Router();
const Task = require("../schemas/task");
const { Scene } = require("../schemas/scene");
const path = require("path");

router.get(
  "/status/multiquery/:project/:executed_by/:operation",
  async (req, res) => {
    const { project, executed_by, operation } = req.params;
    let tasks, returnValue;
    tasks = await Task.find(
      { project, executed_by, operation },
      { requestDate: 1, output_location: 1, input_file: 1, "status.text": 1 }
    );
    res.send(tasks);
  }
);

router.post("/new/:operation/", async (req, res) => {
  const { operation } = req.params;

  switch (operation) {
    case "SIMS":
      const requestDate = new Date();
      const outputLocation = "V:/JP01/Datalake/Common_Write/CLARITY_OUPUT/";
      const {
        fileIDs,
        commandLineArgs,
        simsLocation,
        version,
        project
      } = req.body;
      const files = await Scene.find(
        { _id: { $in: fileIDs } },
        { operations: 1, fileName: 1, path: 1 }
      );

      const scripts = files.map(({ fileName, path }) => {
        const script = createSimsScript({
          version,
          simsLocation,
          commandLineArgs,
          fileName,
          path,
          outputLocation
        });
        return new Task({ operation, project, requestDate, script });
      });

      // files;
      res.send(scripts);

      break;

    default:
      break;
  }

  // const task = new Task(req.body);
  // task.save(error => {
  //   res.send({ error, _id: task._id, success: error ? false : true });
  // });
});

router.put("/update/:id", async (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body)
    .then(results => res.send({ results }))
    .catch(error => res.send({ error }));
});

module.exports = router;

function createSimsScript({
  version,
  simsLocation,
  commandLineArgs,
  fileName,
  path,
  outputLocation
}) {
  return `Set-Location ${simsLocation}; & ./${version}.exe -MeasDir ${path} -MeasFile ${fileName} -OutFolder ${outputLocation} ${commandLineArgs}`;
}
