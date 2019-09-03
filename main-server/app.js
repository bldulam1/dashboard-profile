const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { getCPU_MEM, getNetworkStats } = require("./routines/routine.stats");

console.log(process.env.NODE_ENV)

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

app.use("/api/fs", require("./routes/File"));
app.use("/api/project", require("./routes/Project"));
app.use("/api/upload", require("./routes/Upload"));
app.use("/api/search", require("./routes/Search"));
app.use("/api/tasks", require("./routes/Task"));
app.use("/api/tc", require("./routes/TestCatalog"));
app.use("/api/user", require("./routes/User"));
app.use("/api/naming-convention", require("./routes/NamingConventions"));
app.use("/api/service-workers", require("./routes/ServiceWorkers"));


// const reactAppDir = path.join(__dirname, "../react/build/");
// app.use(express.static(reactAppDir));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(reactAppDir, "index.html"));
// });

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
