const router = require("express").Router();
const Worker = require("../schemas/worker");
router.get("/", async (req, res) => {
  res.send({ test: "hello world" });
});
router.post("/new", async (req, res) => {
  const { serverName } = req.body;
  const worker = await Worker.findOneAndUpdate({ serverName }, req.body, {
    upsert: true,
    new: true
  });
  res.send(worker);
});

module.exports = router;
