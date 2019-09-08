const mongoose = require("mongoose");

const Project = mongoose.model(
  "Project",
  mongoose.Schema({
    name: String,
    operations: [String]
  })
);
mongoose.connect(`mongodb://localhost:27017/clarity`, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.connection.on("error", err => console.log(err));
mongoose.connection.on("open", () => {
  console.log(`${process.pid} database server connected`);
  function ProjectObject(name, operations) {
    return { name, operations };
  }

  const at = [
    "SIMS",
    "CVW Conversion",
    "AMP Check",
    "HIL",
    "IDW4 Conversion",
    "File Splitting"
  ];

  const projects = [
    ProjectObject("Nissan L53H", [at[0], at[1], at[2]]),
    ProjectObject("Renault Nissan", [at[0], at[1], at[2]]),
    ProjectObject("Subaru 77GHz", [at[0], at[1], at[2]]),
    ProjectObject("Subaru SVS", [at[4], at[5]]),
    ProjectObject("Honda", []),
    ProjectObject("Toyota", [])
  ];

  Promise.all(
    projects.map(p =>
      Project.findOneAndUpdate(p, p, { new: true, upsert: true })
    )
  )
    .then(values => console.log(values))
    .catch(err => console.log(err));
});
