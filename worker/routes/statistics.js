const router = require("express").Router();
const si = require("systeminformation");

router.get("/", async (req, res) => {
  const values = await Promise.all([
    si.osInfo(),
    si.networkStats(),
    si.cpu(),
    si.mem()
  ]);
  res.send({
    osInfo: values[0],
    networkStats: values[1],
    cpu: values[2],
    mem: values[3]
  });
});

router.get("/stats/:time", async (req, res) => {
  const values = await Promise.all([
    // si.networkStats(),
    si.currentLoad(),
    si.mem()
  ]);
  res.send({
    // networkStats: values[0],
    cpu: values[0],
    mem: values[1],
    time: req.params.time
  });
});

router.get("/currentLoad", async (req, res) => {
  const currentLoad = await si.currentLoad();
  res.send(currentLoad);
});

router.get("/processes", async (req, res) => {
  const processes = await si.processes();
  res.send(processes);
});

router.get("/networkStatus/:time", async (req, res) => {
  const networkStats = await si.networkStats();
  res.send(networkStats);
});

router.get("/cpu", async (req, res) => {
  const cpu = await si.cpu();
  res.send(cpu);
});

router.get("/mem", async (req, res) => {
  const mem = await si.mem();
  res.send(mem);
});
module.exports = router;
