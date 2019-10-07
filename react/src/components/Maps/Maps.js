import React, { PureComponent } from "react";
import Paper from "@material-ui/core/Paper";
import { setXVIZConfig, getXVIZConfig } from "@xviz/parser";
import {
  LogViewer,
  PlaybackControl,
  StreamSettingsPanel,
  MeterWidget,
  TrafficLightWidget,
  TurnSignalWidget,
  XVIZPanel,
  VIEW_MODE
} from "streetscape.gl";

import { Form } from "@streetscape.gl/monochrome";

import {
  XVIZ_CONFIG,
  APP_SETTINGS,
  MAPBOX_TOKEN,
  MAP_STYLE,
  XVIZ_STYLE,
  CAR
} from "./constants";

setXVIZConfig(XVIZ_CONFIG);

const TIMEFORMAT_SCALE =
  getXVIZConfig().TIMESTAMP_FORMAT === "seconds" ? 1000 : 1;

const exampleLog = require("./log-from-file").default;

export default params => {
  return (
    <Paper
      style={{
        margin: "1rem",
        padding: "1rem",
        width: "100%"
      }}
    >
      <StreetscapeGL />
    </Paper>
  );
};

class StreetscapeGL extends PureComponent {
  state = {
    log: exampleLog,
    settings: {
      viewMode: "PERSPECTIVE",
      showTooltip: false
    }
  };

  componentDidMount() {
    this.state.log.on("error", console.error).connect();
  }

  _onSettingsChange = changedSettings => {
    this.setState({
      settings: { ...this.state.settings, ...changedSettings }
    });
  };

  render() {
    const { log, settings } = this.state;
    const hudHR = { margin: 0, opacity: 0.3 };

    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            width: "320px",
            padding: "12px",
            position: "relative",
            zIndex: 1,
            boxShadow: "0 0 8px rgba(0,0,0,0.3)",
            height: "100%",
            overflow: "auto"
          }}
        >
          <XVIZPanel log={log} name="Metrics" />
          <hr
            style={{
              margin: "24px -12px",
              opacity: 0.3
            }}
          />
          <XVIZPanel log={log} name="Camera" />
          <hr
            style={{
              margin: "24px -12px",
              opacity: 0.3
            }}
          />
          <Form
            data={APP_SETTINGS}
            values={this.state.settings}
            onChange={this._onSettingsChange}
          />
          <StreamSettingsPanel log={log} />
        </div>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%"
          }}
        >
          <div
            style={{
              flexGrow: 1,
              position: "relative",
              maxHeight: "100%"
            }}
          >
            <LogViewer
              log={log}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              mapStyle={MAP_STYLE}
              car={CAR}
              xvizStyles={XVIZ_STYLE}
              showTooltip={settings.showTooltip}
              viewMode={VIEW_MODE[settings.viewMode]}
            />
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 8px rgba(0,0,0,0.3)"
              }}
            >
              <TurnSignalWidget log={log} streamName="/vehicle/turn_signal" />
              <hr style={hudHR} />
              <TrafficLightWidget
                log={log}
                streamName="/vehicle/traffic_light"
              />
              <hr style={hudHR} />
              <MeterWidget
                log={log}
                streamName="/vehicle/acceleration"
                label="Acceleration"
                min={-4}
                max={4}
              />
              <hr style={hudHR} />
              <MeterWidget
                log={log}
                streamName="/vehicle/velocity"
                label="Speed"
                getWarning={x => (x > 6 ? "FAST" : "")}
                min={0}
                max={20}
              />
            </div>
          </div>
          <div
            style={{
              padding: "24px 0",
              position: "relative"
            }}
          >
            <PlaybackControl
              width="100%"
              log={log}
              formatTimestamp={x =>
                new Date(x * TIMEFORMAT_SCALE).toUTCString()
              }
            />
          </div>
        </div>
      </div>
    );
  }
}
