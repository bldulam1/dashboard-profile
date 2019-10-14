const router = require("express").Router();
const { Scene } = require("../schemas/scene");
const Task = require("../schemas/task");
const Worker = require("../schemas/worker");
const { createSimsTasks } = require("./Operations/Operation.SIMS");
const {
  createCVWOperationTasks
} = require("./Operations/Operation.CVWConversion");
const {
  createIDW4ConvTasks
} = require("./Operations/Operation.IDW4Conversion");
const {
  fetchFileInfo,
  alignFileInfo
} = require("./Operations/Operation.ExportList");
const { createHILTasks } = require("./Operations/Operation.HILRun");

const { executeTasks } = require("../utils/taskAssignment");
const Path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");

router.get("/:project", async (req, res) => {
  const { query, sort, skip, limit } = JSON.parse(req.query.queryString);
  query.project = req.params.project;

  const [count, tasks] = await Promise.all([
    Task.countDocuments(query),
    Task.find(query, null, { skip, limit, sort })
  ]);

  res.send({ skip, limit, count, tasks });
});

router.post("/:operation/new", async (req, res) => {
  const { operation } = req.params;
  const files = await Scene.find(
    { _id: { $in: req.body.fileIDs } },
    { fileName: 1, path: 1, size: 1 }
  );
  let tasks = [];
  switch (operation) {
    case "CVW Conversion": {
      tasks = await createCVWOperationTasks(req.body, files);
      executeTasks();
      return res.send(tasks);
    }
    case "Export List": {
      const { fileIDs, selectedFileInfo } = req.body;
      const fileInfo = await fetchFileInfo(fileIDs);
      return res.send(await alignFileInfo(fileInfo, selectedFileInfo));
    }
    case "File Splitting": {
      return res.send("Hello");
    }
    case "HIL": {
      tasks = await createHILTasks(req.body, files);
      executeTasks();
      return res.send(files);
    }
    case "IDW4 Conversion": {
      tasks = await createIDW4ConvTasks(req.body, files);
      executeTasks();
      return res.send(tasks);
    }
    case "SIMS": {
      tasks = await createSimsTasks(req.body, files);
      executeTasks();
      return res.send(tasks);
    }
    default:
      break;
  }
});

router.put("/update/:id", async (req, res) => {
  const newData = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.send(newData);
  if (["Completed", "Aborted"].includes(newData.status.text)) {
    Worker.findOneAndUpdate(
      { serverName: newData.assignedWorker },
      { taskID: null },
      { new: true }
    ).then(executeTasks);
  }
});

router.post(
  "/check-extensions/:project/:operation/ext=:extension",
  async (req, res) => {
    const { extension } = req.params;
    const { fileIDs } = req.body;
    const inValidFiles = await Scene.find(
      {
        _id: { $in: fileIDs },
        extension: { $ne: extension }
      },
      { fileName: 1 }
    );
    res.send(inValidFiles);
  }
);

router.get("/:project/get-ids/query=:queryString(*)", async (req, res) => {
  const query = JSON.parse(req.params.queryString);
  const tasks = await Task.find(query, { _id: 1 });
  res.send(tasks.map(({ _id }) => _id));
});

router.post("/general-request/SIMS", async (req, res) => {
  const createTimeStamp = require("../utils/timeStamp");
  const requestDate = new Date();

  const {
    measDir,
    measFile,
    commandLine,
    simsLocation,
    simsBinary,
    project,
    username
  } = req.body;

  const objKeys = [
    "measDir",
    "measFile",
    "commandLine",
    "simsLocation",
    "simsBinary",
    "project",
    "username"
  ];

  let missingKeys = objKeys.reduce(
    (allMissing, key) => (!req.body[key] ? [...allMissing, key] : allMissing),
    []
  );

  if (missingKeys.length) {
    res.status(400).send({ missingKeys });
  } else {
    const fullFile = Path.resolve(measDir, measFile);
    const simsFP = Path.resolve(simsLocation, simsBinary);

    if (!fs.existsSync(fullFile)) {
      res.status(400).send(`File not found: ${fullFile}`);
    } else if (!fs.existsSync(simsFP)) {
      res.status(400).send(`SIMS not found: ${simsFP}`);
    } else {
      const outputFolder = Path.resolve(
        "V:/JP01/DataLake/Common_Write/CLARITY_OUPUT/",
        project,
        "SIMS",
        username,
        createTimeStamp(requestDate)
      ).replace(/ /g, "_");

      mkdirp(outputFolder, err => {
        if (err) return console.error(err);
        const script = `Set-Location ${simsLocation}; ./${simsBinary} -MeasDir ${measDir} -MeasFile ${measFile} -OutFolder ${outputFolder} ${commandLine}`;
        console.log(script);
      });

      res.send({ outputFolder });
    }
  }
});

module.exports = router;
