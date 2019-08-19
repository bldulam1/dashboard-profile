const Worker = require("../schemas/worker");
const axios = require("axios");

async function getCPU_MEM() {
  const time = new Date();
  const workers = await Worker.find();

  workers.forEach(({ _id, url, cpu, mem }) => {
    axios
      .get(`${url}/stats/${time.toLocaleString()}`)
      .then(async res => {
        const cpus = res.data.cpu.cpus.map(cpu => cpu.load);
        const { currentload } = res.data.cpu;
        const { total, free, used } = res.data.mem;
        // console.log(res.data.mem);
        await Worker.findByIdAndUpdate(_id, {
          cpu: [...cpu.slice(0, 59), { time, cpus, currentload }],
          mem: [...mem.slice(0, 59), { time, total, free, used }],
          active: true
        });
      })
      .catch(async err => {
        await Worker.findByIdAndUpdate(_id, {
          active: false
        });
      });
  });
}

async function getNetworkStats() {
  const time = new Date();
  const workers = await Worker.find();

  workers.forEach(({ _id, url, network }) => {
    axios
      .get(`${url}/networkStatus/${time.toLocaleString()}`)
      .then(async ({ data }) => {
        await Worker.findByIdAndUpdate(_id, {
          network: [...network.slice(0, 59), { time, ifaces: data }],
          active: true
        });
      })
      .catch(async err => {
        await Worker.findByIdAndUpdate(_id, {
          active: false
        });
      });
  });
}

module.exports = {
  getCPU_MEM,
  getNetworkStats
};
