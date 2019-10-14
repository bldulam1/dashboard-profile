import React from "react";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "../../styles/classes";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ReactHighmaps from "react-highcharts/ReactHighmaps";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import uuid from "uuid/v4";
export default () => {
  const [state, setState] = React.useState({
    charts: []
  });

  React.useEffect(() => {
    const url = `${api_server}/kpi/moshemoshe/one/accuracyChartList.json`;
    // const url = `${api_server}/kpi/moshemoshe/one/trackDropChartList.json`;
    Axios.get(url)
      .then(results => setState({ charts: results.data }))
      .catch(err => console.log(err));
    return () => {};
  }, []);

  const classes = useStyles();
  return (
    <Paper className={classes.contentPaper}>
      {state.charts
        // .slice(0, Math.floor(state.charts.length / 2))
        .map(plotElements => {
          let isTrackDropChart = plotElements.name
              .toLowerCase()
              .includes("drop"),
            isTrackPerfChart = plotElements.path
              .toLowerCase()
              .includes("performance"),
            isAccLineChart =
              plotElements.path.includes("TestResults") &&
              plotElements.path.includes("plots"),
            isStackedBarChart = plotElements.hasOwnProperty("bars");
            // isDeviationOccurChart =
            //   plotElements.hasOwnProperty("DataOk") &&
            //   plotElements.hasOwnProperty("DataNok");

          if (isTrackPerfChart || isTrackDropChart)
            return <HeatMap key={uuid()} plotElements={plotElements} />;
          else if (isAccLineChart)
            return <LineChart key={uuid()} plotElements={plotElements} />;
          else if (isStackedBarChart)
            return <StackedPlot key={uuid()} plotElements={plotElements} />;
          //  (isDeviationOccurChart)
            return (
              <StackedPercentCol key={uuid()} plotElements={plotElements} />
            );
        })}
    </Paper>
  );
};

function LineChart(props) {
  const { plotElements } = props;

  var yy;
  var maxY = 1;
  var minY = -1;

  const chartSeries = [];
  for (var i = 0; i < plotElements.series.length; i++) {
    yy = plotElements.series[i].sort(function(a, b) {
      //presorting is required by HighCharts
      return a[0] - b[0];
    });

    chartSeries.push({
      name: "Series " + (i + 1),
      data: yy
    });

    yy = yy.map(function(x) {
      return x[1];
    });
    if (maxY < Math.max(...yy)) maxY = Math.max(...yy);
    if (minY > Math.min(...yy)) minY = Math.min(...yy);
  }

  chartSeries.push({
    color: "red",
    name: "Mean",
    data: plotElements.Mean.sort(function(a, b) {
      //presorting is required by HighCharts
      return a[0] - b[0];
    })
  });
  chartSeries.push({
    color: "green",
    name: "Standard Deviation",
    data: plotElements.StDev.sort((a, b) => {
      //presorting is required by HighCharts
      return a[0] - b[0];
    })
  });

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          events: {
            load: event => event.target.reflow()
          }
        },
        title: {
          text: ""
        },
        xAxis: {
          minPadding: 0.05,
          maxPadding: 0.05,
          title: {
            text: plotElements.xLab
          }
        },
        yAxis: {
          max: maxY * 1.1,
          endOnTick: true,
          min: minY * 1.1,
          startOnTick: true,
          plotLines: [
            {
              color: "blue", // Color value
              dashStyle: "longdash", // Style of the plot line. Default to solid
              value: 1, // Value of where the line will appear
              width: 2 // Width of the line
            },
            {
              color: "blue", // Color value
              dashStyle: "longdash", // Style of the plot line. Default to solid
              value: -1, // Value of where the line will appear
              width: 2 // Width of the line
            }
          ],
          title: {
            text: plotElements.yLab
          }
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false
            }
          }
        },
        tooltip: {
          shared: true,
          // formatter: function() {
          //   var s = '<b>' + this.x + '</b><br/>';
          //   $.each(this.points, function() {
          //     s += '<span style="color:' + this.series.color + '">' + this.series.name + ': <b>' + section.convertVal(this.y) + '</b><br/>';
          //   });
          //   return s;
          // },
          hideDelay: 50
        },

        series: chartSeries
      }}
    />
  );
}

function StackedPlot(props) {
  const { plotElements } = props;
  var ndata = [];
  plotElements.bars.forEach(function(item) {
    item > 0 ? ndata.push(item * -1) : ndata.push(item);
  });

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          events: {
            load: function(event) {
              event.target.reflow();
            }
          },
          type: "bar"
        },
        title: {
          text: ""
        },
        xAxis: {
          categories: plotElements.yVal,
          reversed: false,
          title: {
            text: plotElements.yLab
          },
          labels: {
            step: 1
          }
        },
        yAxis: {
          min: -1 * plotElements.line - 1,
          max: plotElements.line + 1,
          title: {
            text: plotElements.xLab
          },
          labels: {
            formatter: function() {
              return Math.abs(this.value);
            }
          },
          plotLines: [
            {
              value: -1 * plotElements.line,
              color: "red",
              dashStyle: "longdash",
              width: 2
            },
            {
              value: plotElements.line,
              color: "red",
              dashStyle: "longdash",
              width: 2
            }
          ]
        },
        plotOptions: {
          series: {
            stacking: "normal"
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          formatter: function() {
            return (
              "<b>Mean Error: " +
              this.point.category +
              "</b><br/>" +
              "at" +
              Highcharts.numberFormat(this.point.y)
            );
          }
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [
          {
            data: plotElements.bars,
            color: "#16A085"
          },
          {
            data: ndata,
            color: "#16A085"
          }
        ]
      }}
    />
  );
}

function StackedPercentCol(props) {
  const { plotElements } = props;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          events: {
            load: function(event) {
              event.target.reflow();
            }
          },
          type: "column"
        },
        title: {
          text: ""
        },
        xAxis: {
          categories: plotElements.xVal,
          title: {
            text: plotElements.xLab
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: plotElements.yLab
          }
        },
        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
          shared: true
        },
        plotOptions: {
          column: {
            stacking: "percent"
          }
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [
          {
            name: plotElements.legendok,
            data: plotElements.DataOk
          },
          {
            name: plotElements.legendnok,
            data: plotElements.DataNok
          }
        ]
      }}
    />
  );
}

function HeatMap(props) {
  let { plotElements } = props;
  var data = [];
  plotElements.table.forEach((value, index) => {
    data.push([0, index, value]);
  });
  plotElements.table = data;
  console.log(plotElements);

  return (
    <ReactHighmaps
      config={{
        title: {
          text: "" // should be left "" so that the title will not display
        },
        chart: {
          events: {
            load: function(event) {
              event.target.reflow();
            }
          },
          type: "heatmap",
          marginTop: 0,
          marginBottom: 70,
          plotBorderWidth: 1
        },
        xAxis: {
          title: {
            enabled: true,
            text: plotElements.xLab
          },
          categories: plotElements.xVal
        },
        yAxis: {
          title: {
            enabled: true,
            text: plotElements.yLab
          },
          categories: plotElements.yVal
        },
        colorAxis: {
          min: 0,
          minColor: "#FFFFFF",
          maxColor: Highcharts.getOptions().colors[0]
        },
        legend: {
          align: "right",
          layout: "vertical",
          margin: 0,
          verticalAlign: "top",
          y: 25,
          symbolHeight: 200,
          enabled: false
        },
        tooltip: {
          formatter: function() {
            return (
              "<b>" +
              this.point.value +
              "</b> occurence(s) <br>at <b>" +
              this.series.yAxis.categories[this.point.y] +
              "</b>m with relative velocity of <b>" +
              this.series.xAxis.categories[this.point.x] +
              "</b>km/h<b>" +
              "</b>"
            );
          }
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [
          {
            name: plotElements.xLab,
            borderWidth: 1,
            data: plotElements.table,
            dataLabels: {
              enabled: true,
              color: "#000000"
            }
          }
        ]
      }}
    />
  );
}
