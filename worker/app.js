const express = require("express");
const cors = require("cors");
const app = express();
// const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const axios = require("axios");
const props = require("./config/processArgs");

app.use(bodyParser.urlencoded({ extended: false, limit: "1000mb" }));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(logger("dev"));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"]
  })
);
app.set("view options", { pretty: true });
app.use("/tasks", require("./routes/tasks"));
app.use("/fileSearch", require("./routes/fileSearch"));
app.use("/", require("./routes/statistics"));

// mongoose.connect(`mongodb://localhost:27017/clarity`, {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useCreateIndex: true
// });
// mongoose.connection.on("error", err => console.log(err));
// mongoose.connection.on("open", () => {
//   console.log(`${process.pid} database server connected`);
app.listen(props.port, async () => {
  const { mainHost, mainPort, allowedTasks } = props;
  const mainURL = `http://${mainHost}:${mainPort}/service-workers/new`;
  const { hostname, port, serverName, url } = props;
  await axios.post(mainURL, {
    hostname,
    port,
    serverName,
    url,
    allowedTasks,
    taskID: null
  });

  console.log(`Service worker is listening on port ${port}!`);
});
// });
