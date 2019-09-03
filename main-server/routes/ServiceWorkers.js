const router = require("express").Router();
const Worker = require("../schemas/worker");

// root: /service-workers

router.get("/stats-on/all", async (req, res) => {
  const workers = await Worker.find({}, null, {
    sort: { active: 1, serverName: 1 }
  });
  res.send(workers);
});

router.get("/stats-on/current-only", async (req, res) => {
  const workers = await Worker.find({}, null, {
    sort: { active: 1, serverName: 1 }
  });

  res.send(
    workers.map(worker => {
      const cpu = worker.cpu[worker.cpu.length - 1].currentload;
      const { used, total } = worker.mem[worker.mem.length - 1];
      const { ifaces } = worker.network[worker.network.length - 1];
      const rx_bytes = ifaces.reduce((acc, { rx_bytes }) => acc + rx_bytes, 0);
      const tx_bytes = ifaces.reduce((acc, { tx_bytes }) => acc + tx_bytes, 0);
      const { serverName } = worker;

      return {
        serverName,
        cpu,
        mem: used / total,
        rx_bytes,
        tx_bytes
      };
    })
  );
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
