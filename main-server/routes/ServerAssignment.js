const router = require("express").Router();
const ServerType = require("../schemas/serverType");

router.post("/new", async (req, res) => {
  new ServerType(req.body)
    .save()
    .then(results => res.send(results))
    .catch(error => res.send(error));
});

router.get("/all", async (req, res) => {
  ServerType.find({})
    .then(results => res.send(results))
    .catch(() => res.send([]));
});

router.put("/update/:id", async (req, res) => {
  res.send(await ServerType.findByIdAndUpdate(req.params.id, req.body));
});

module.exports = router;
