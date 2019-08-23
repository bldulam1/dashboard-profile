const router = require("express").Router();
const Worker = require("../schemas/worker");

// root: /service-workers

router.get("/stats-on/all", async (req, res) => {
  const workers = await Worker.find({});
  res.send(workers);
});

router.get("/stats-off/all", async (req, res) => {
  const workers = await Worker.find({}, { serverName: 1, url: 1, active: 1 });
  res.send(workers);
});

router.get("/one/id", async (req, res) => {
  const workers = await Worker.find({});
  res.send(workers);
});

router.post("/new", async (req, res) => {
  const { serverName } = req.body;
  const worker = await Worker.findOneAndUpdate(
    { serverName },
    { ...req.body, active: true },
    {
      upsert: true,
      new: true
    }
  );
  res.send(worker);
});

module.exports = router;
