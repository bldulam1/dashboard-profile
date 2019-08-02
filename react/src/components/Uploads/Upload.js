import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import UploadInput from "./Upload.Input";
import UploadStatus from "./Upload.Status";
import { ProjectContext } from "../../context/Project.Context";
import { UploadContext } from "../../context/Upload.Context";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    height: "100%",
    margin: "auto"
  },
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  }
}));

const namingConventions = [
  NConvention("None", []),
  NConvention(
    "NC01",
    [
      NCElement("date", "8", null),
      NCElement("time", "6", null),
      NCElement("function", null, ["FCR", "RCR", "4CR"]),
      NCElement("customer", null, ["NISSAN", "RENAULT"]),
      NCElement("software", null, [
        "R0100B00",
        "R0101B01",
        "R0200B00",
        "R0201B01",
        "R0201B90",
        "R0300B00",
        "R0301B01",
        "R0400B00",
        "R0401B01",
        "R0500B00",
        "R0501B01",
        "R0600B00",
        "R0601B01",
        "R0700B00",
        "R0701B01"
      ]),
      NCElement("Rec Location", null, [
        "DC",
        "GKN",
        "DKT",
        "VNBSH",
        "VNBST",
        "JARI",
        "JARISTC",
        "JARIRH",
        "JARIUR",
        "NILIM",
        "NILIMT",
        "JPR001",
        "JPR002",
        "JPR003",
        "JPR004",
        "JPR005",
        "JPR006",
        "JPR007",
        "JPR008",
        "JPR009",
        "JPR010",
        "JPR011",
        "JPR012",
        "JPR013",
        "JPR014",
        "JPR015",
        "JPR016",
        "JPR017",
        "JPR018",
        "JPR019",
        "JPR020",
        "JPR021",
        "JPR022",
        "JPR023",
        "JPR024",
        "JPR025",
        "JPR026",
        "JPR027",
        "JPR028",
        "JPR029",
        "JPR030",
        "JPR031",
        "JPR032",
        "JPR033",
        "JPR034",
        "JPR035",
        "JPR036",
        "JPR037",
        "JPR038",
        "JPR039",
        "JPR040",
        "JPR041",
        "JPR042",
        "JPR043",
        "JPR044",
        "JPR045",
        "JPR046",
        "JPR047",
        "JPR048",
        "JPR049",
        "JPR050"
      ]),
      NCElement("Vehicle", null, [
        "JSOSKYLINE01",
        "JSOSKYLINE02",
        "JSOXTRAIL01",
        "FCTESPASE01"
      ]),
      NCElement("Test Catalog Label", null, [
        "FLCA",
        "FLCW",
        "FCTA",
        "FCTB",
        "RLCA",
        "RBSW",
        "RCTA",
        "RCTB",
        "AEOL",
        "OSE",
        "FALG",
        "RALG",
        "RNGE",
        "SPSC",
        "FRSP",
        "BLCK"
      ]),
      NCElement("Major", 2, null),
      NCElement("Minor", 4, null),
      NCElement("Side", null, ["L", "R", "B"]),
      NCElement("Iteration", 2, null)
    ],
    "_"
  ),
  NConvention(
    "NC02",
    [
      NCElement("date", "8", null),
      NCElement("time", "6", null),
      NCElement("function", null, ["RC", "ASD"])
    ],
    "^"
  )
];

const group1 = [
  "Target Vehicle 1",
  "Target Vehicle 2",
  "Target Vehicle 3",
  "Weather",
  "Recording Location"
].sort();
const group2 = ["PLM", "PTC", "DOORS", "JIRA", "Sharepoint"].sort();
const keyOptions = [...group1, ...group2];

function getTimeStamp() {
  const newTime = new Date();
  return {
    year: newTime.getFullYear(),
    month: newTime.getMonth(),
    day: newTime.getDate(),
    minute: newTime.getMinutes(),
    hour: newTime.getHours(),
    second: newTime.getSeconds()
  };
}

export default props => {
  const classes = useStyles();
  const { activeProject } = React.useContext(ProjectContext);

  const [files, setFiles] = React.useState([]);
  const [tags, setTags] = React.useState([{ key: keyOptions[0], value: "" }]);
  const [
    selectedNamingConvention,
    setSelectedNamingConvention
  ] = React.useState("NC01");

  const rootPath = "V:\\JP01\\DataLake";
  const [storageLocation, setStorageLocation] = React.useState(
    `${rootPath}\\Valpro\\${activeProject}\\username\\`
  );

  return (
    <Paper className={classes.contentPaper}>
      <Grid container spacing={3} className={classes.container}>
        <UploadContext.Provider
          value={{
            files,
            setFiles,
            keyOptions,
            tags,
            setTags,
            namingConventions,
            selectedNamingConvention,
            setSelectedNamingConvention,
            rootPath,
            storageLocation,
            setStorageLocation
          }}
        >
          <UploadStatus />
          <UploadInput />
        </UploadContext.Provider>
      </Grid>
    </Paper>
  );
};

function NCElement(name, length, options) {
  return { name, length, options };
}

function NConvention(name, elements, separator, extension) {
  return { name, elements, separator, extension };
}
