const router = require("express").Router();
const json2csv = require("json2csv").parse;
const Task = require("../schemas/task");
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

router.post("/new", async (req, res) => {
  const task = new Task(req.body);
  task.save(error => {
    res.send({ error, _id: task._id, success: error ? false : true });
  });
});

router.put("/update/:id", async (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body)
    .then(results => res.send({ results }))
    .catch(error => res.send({ error }));
});

module.exports = router;
