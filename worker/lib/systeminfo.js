const si = require("systeminformation");
const os = require('os');
const hostname = os.hostname().toLowerCase();

module.exports = {
  hostname
};
