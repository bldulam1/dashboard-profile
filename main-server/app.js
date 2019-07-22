const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const logger = require('morgan');

const port = 8000;
app.use(logger('dev'));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"]
  })
);

app.use("/search", require("./routes/Search"));
app.get("/", (req, res) => res.send("Hello World!"));

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
  });
});
