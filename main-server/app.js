const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const { getCPU_MEM, getNetworkStats } = require("./routines/routine.stats");

const port = 8000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"]
  })
);
app.set("view options", { pretty: true });

app.use("/fs", require("./routes/File"));
app.use("/upload", require("./routes/Upload"));
app.use("/search", require("./routes/Search"));
app.use("/task", require("./routes/Task"));
app.use("/tc", require("./routes/TestCatalog"));
app.use("/naming-convention", require("./routes/NamingConventions"));
app.use("/service-workers", require("./routes/ServiceWorkers"));
app.get("/", (req, res) => res.send("Hello World!2"));

mongoose.connect(`mongodb://localhost:27017/clarity`, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.connection.on("error", err => console.log(err));
mongoose.connection.on("open", () => {
  console.log(`${process.pid} database server connected`);
  app.listen(port, () => {
    console.log(`Clarity is listening on port ${port}!`);
    // setInterval(getCPU_MEM, 1000);
    // setInterval(getNetworkStats, 5000);
  });
});
