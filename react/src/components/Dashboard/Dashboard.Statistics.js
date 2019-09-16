import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import { ProjectContext } from "../../context/Project.Context";
import { UserContext } from "../../context/User.Context";
import Switch from "@material-ui/core/Switch";
import ReactHighcharts from "react-highcharts";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { normalizeSize } from "../../util/strings";

const useStyles = makeStyles(theme => ({
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  card: {
    backgroundColor: theme.palette.primary.dark,
    flexGrow: 1,
    margin: theme.spacing(2)
  },
  title: {
    fontSize: 14,
    color: "white",
    textTransform: "uppercase"
  },
  white: {
    color: "white"
  }
}));
export default () => {
  const classes = useStyles();
  const { activeProject } = useContext(ProjectContext);
  const { name } = useContext(UserContext).user;
  const [state, setstate] = useState({
    tasks: { completed: 0, total: 0 },
    activeUsers: [],
    fileDates: [],
    fileTypes: [],
    distBySize: false
  });

  useEffect(() => {
    const url = `${api_server}/statistics/${activeProject}/${name}`;
    Axios.get(url).then(results => {
      const { activeUsers, fileDates, fileTypes, tasks } = results.data;
      console.log(results.data);
      setstate({ activeUsers, fileDates, fileTypes, tasks });
    });
    return () => {};
  }, [activeProject, name]);

  const handleChange = (key, value) => {
    setstate({ ...state, [key]: value });
  };

  return (
    <div>
      <div className={classes.cardContainer}>
        <CardStatistics
          title="Disk Storage"
          value={normalizeSize(
            state.fileTypes.reduce((sum, ft) => sum + ft.totalSize, 0)
          )}
        />
        <CardStatistics
          title="Clients"
          value={state.activeUsers.filter(u => u._id === true).length}
          unit={"Online"}
        />
        <CardStatistics
          title="Completed Tasks"
          value={`${state.tasks.completed}`}
          unit={`Total: ${state.tasks.total}`}
        />
      </div>
      <ReactHighcharts config={diskSpaceGenerateOptions(state.fileDates)} />
      <div>
        Quantity
        <Switch
          color="primary"
          checked={state.checkedA}
          onChange={() => handleChange("distBySize", !state.distBySize)}
          value={state.checkedA}
          inputProps={{ "aria-label": "secondary checkbox" }}
          title=""
        />
        Size
      </div>
      <ReactHighcharts
        config={pieChartGenerateOptions(
          state.fileTypes
            .map(ft => ({
              y: state.distBySize ? ft.totalSize : ft.count,
              name: ft._id
            }))
            .sort((a, b) => b.y - a.y)
        )}
      />
    </div>
  );
};

function CardStatistics(params) {
  const classes = useStyles();
  const { title, value, unit } = params;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography align="center" className={classes.title}>
          {title}
        </Typography>
        <Typography
          align="center"
          variant="h3"
          component="h2"
          className={classes.white}
        >
          {value}
        </Typography>
        <Typography align="center" className={classes.white}>
          {unit}
        </Typography>
      </CardContent>
    </Card>
  );
}

function pieChartGenerateOptions(data) {
  return {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie"
    },
    title: {
      text: "Data distribution by file type"
    },
    credits: {
      enabled: false
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: `<b>{point.name}</b>: {point.percentage:.1f} %`
        }
      }
    },
    series: [
      {
        name: "File Type",
        colorByPoint: true,
        data
      }
    ]
  };
}

function diskSpaceGenerateOptions(data) {
  return {
    chart: {
      zoomType: "x"
    },
    title: {
      text: "Data Stored in Isilon over time"
    },
    credits: {
      enabled: false
    },
    subtitle: {
      text:
        document.ontouchstart === undefined
          ? "Click and drag in the plot area to zoom in"
          : "Pinch the chart to zoom in"
    },
    xAxis: {
      type: "datetime"
    },
    yAxis: {
      title: {
        text: "Disk Space in Bytes"
      },
      min: 0
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [[0, "#2f7ed8"], [1, "#ddddf0"]]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },

    series: [
      {
        type: "area",
        name: "Consumed Disk Space",
        data
      }
    ]
  };
}
