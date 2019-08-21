const router = require("express").Router();
const Worker = require("../schemas/worker");
router.get("/", async (req, res) => {
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
