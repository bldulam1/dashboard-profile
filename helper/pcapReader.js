var pcapp = require("pcap-parser");

var parser = pcapp.parse(
  "C:/Users/brendon.dulam/Downloads/mytrace_00001_20191001094124.pcap"
);
// parser.on("packet", function(packet) {
//   console.log(packet.data);
//   // do your packet processing
// });
