const router = require("express").Router();
const { Scene, SearchFolder } = require("../schemas/scene");

router.get("/:project/count", async (req, res) => {
  const count = await Scene.countDocuments({});
  res.send({
    count
  });
});

module.exports = router;
