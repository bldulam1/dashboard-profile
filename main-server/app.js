const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");
const { getCPU_MEM, getNetworkStats } = require("./routines/routine.stats");

const httpsPort = 4444;
const httpPort = 8080;

app.use(bodyParser.urlencoded({ extended: false, limit: "1000mb" }));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(logger("dev"));
app.use(
  cors({
    credentials: true,
    origin: [
      "https://jp01-of-wl8197",
      "https://jp01-clarity01",
      "https://jp01-clarity01.corp.int"
    ]
  })
);
app.set("view options", { pretty: true });

app.use("/fs", require("./routes/File"));
app.use("/overpass", require("./routes/Overpass"));
app.use("/project", require("./routes/Project"));
app.use("/upload", require("./routes/Upload"));
app.use("/search", require("./routes/Search"));
app.use("/tasks", require("./routes/Task"));
app.use("/tc", require("./routes/TestCatalog"));
app.use("/user", require("./routes/User"));
app.use("/naming-convention", require("./routes/NamingConventions"));
app.use("/service-workers", require("./routes/ServiceWorkers"));
app.get("/", (req, res) => res.send("Hello World!2"));

const key = fs.readFileSync("./certificates/selfsigned.key");
const cert = fs.readFileSync("./certificates/selfsigned.crt");
const options = { key, cert };

mongoose.connect(`mongodb://localhost:27017/clarity`, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.connection.on("error", err => console.log(err));
mongoose.connection.on("open", () => {
  console.log(`${process.pid} database server connected`);
  var server = https.createServer(options, app);
  server.listen(httpsPort, () => {
    console.log(`Clarity is listening on port ${httpsPort}!`);
    setInterval(getCPU_MEM, 1000);
    setInterval(getNetworkStats, 5000);
  });
  app.listen(httpPort, () => {
    console.log(`Clarity is listening on port ${httpPort}`);
  });
});
