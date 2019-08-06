const router = require("express").Router();
const si = require("systeminformation");

router.get("/", async (req, res) => {
  const osInfo = await si.osInfo();
  res.send(osInfo);
});

router.get("/currentLoad", async (req, res) => {
  const currentLoad = await si.currentLoad();
  res.send(currentLoad);
});

router.get("/processes", async (req, res) => {
  const processes = await si.processes();
  res.send(processes);
});

router.get("/networkStatus", async (req, res) => {
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
