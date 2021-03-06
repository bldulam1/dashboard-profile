const Worker = require("../schemas/worker");
const axios = require("axios");
const MAXLEN = 12;

async function getCPU_MEM() {
  const time = new Date();
  const workers = await Worker.find({}, { url: 1, cpu: 1, mem: 1 });

  workers.forEach(({ _id, url, cpu, mem }) => {
    axios
      .get(`${url}/stats/${time}`)
      .then(async res => {
        const cpus = res.data.cpu.cpus.map(cpu => cpu.load);
        const { currentload } = res.data.cpu;
        const { total, free, used } = res.data.mem;
        // console.log(res.data.mem);
        await Worker.findByIdAndUpdate(_id, {
          cpu: [...cpu.slice(0, MAXLEN - 1), { time, cpus, currentload }],
          mem: [...mem.slice(0, MAXLEN - 1), { time, total, free, used }],
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
  const workers = await Worker.find({}, { url: 1, network: 1 });

  workers.forEach(({ _id, url, network }) => {
    axios
      .get(`${url}/networkStatus/${time}`)
      .then(async ({ data }) => {
        await Worker.findByIdAndUpdate(_id, {
          network: [...network.slice(0, MAXLEN - 1), { time, ifaces: data }],
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
