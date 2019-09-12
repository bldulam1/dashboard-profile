import React, { useContext, useState, useEffect } from "react";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import RLDD from "react-list-drag-and-drop/lib/RLDD";
import {
  Button,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";
import Axios from "axios";
import { api_server } from "../../../../environment/environment";
import { ProjectContext } from "../../../../context/Project.Context";
import fileDownload from "js-file-download";

const useStyles = makeStyles(theme => ({
  itemWrapper: {
    display: "flex",
    flexDirection: "row",
    cursor: "move",
    border: "1px solid black",
    margin: "0.5rem",
    padding: "0 1rem",
    borderRadius: "0.5rem"
  },
  itemPriority: {
    width: "5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  itemContent: {
    width: "85%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  itemAction: {
    width: "10%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  }
}));

export default () => {
  const { itemWrapper, itemPriority, itemContent, itemAction } = useStyles();
  const { activeProject } = useContext(ProjectContext);
  const { tcProps, tcDispatch } = useContext(TestCatalogContext);
  const { selected, cols } = tcProps;
  const [state, setState] = useState({ showColumns: [] });

  useEffect(() => {
    setState({
      showColumns: cols
        .map(col => col.id)
        .filter(ch => !["Record ID"].includes(ch))
    });
  }, [cols]);

  const headers = [
    "Sequence",
    "Priority",
    "Status",
    "Scenario",
    "Catalog Label",
    ...state.showColumns.filter(ch => !["Record ID"].includes(ch)),
    "Trials",
    "Total Time",
    "Target Type",
    "Data Volume"
  ];

  let items = selected.map((s, i) => ({ id: i, ...s }));

  const handleRLDDChange = newItems => tcDispatch({ selected: newItems });
  const handleExportClick = () => {
    Axios(
      {
        url: `${api_server}/tc/${activeProject}/create-schedule`,
        method: "POST",
        responseType: "blob",
        data: { selected }
      },
      { selected }
    ).then(results => {
      fileDownload(results.data, "schedule.xlsx");
    });
  };

  const handleChange = event => {
    setState(oldState => ({
      ...oldState,
      [event.target.name]: event.target.value
    }));
  };

  const totalTime = selected.reduce((sum, s) => sum + (s.Time || 0) * 3, 0);

  return (
    <div>
      <div>
        <Button onClick={handleExportClick}>Export</Button>
        <FormControl>
          <InputLabel htmlFor="showColumns-simple">Show Columns</InputLabel>
          <Select
            multiple
            value={state.showColumns}
            onChange={handleChange}
            inputProps={{
              name: "showColumns",
              id: "showColumns-simple"
            }}
          >
            {cols
              .filter(ch => !["Record ID"].includes(ch.id))
              .map(col => (
                <MenuItem value={col.id}>{col.id}</MenuItem>
              ))}
            {/* <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
        </FormControl>
      </div>
      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map(header => (
                <TableCell>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {selected.map((s, index) => (
              <TableRow>
                {headers.map(header => (
                  <TableCell>
                    {header === "Sequence"
                      ? index
                      : header === "Priority"
                      ? ""
                      : header === "Status"
                      ? "Pending"
                      : header === "Catalog Label"
                      ? s["Record ID"]
                      : header === "Trials"
                      ? 3
                      : header === "Total Time"
                      ? s.Time * 3
                      : header === "Data Volume"
                      ? `${s.Time * 60} GB`
                      : s[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              {headers.map(header => (
                <TableCell>
                  {header === "Sequence"
                    ? "Total"
                    : header === "Total Time"
                    ? totalTime
                    : header === "Data Volume"
                    ? `${totalTime * 20} GB`
                    : ""}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* <RLDD
        items={items}
        itemRenderer={(item, index) => {
          return (
            <div className={itemWrapper}>
              <div className={itemPriority}>{index}</div>
              <div className={itemContent}>{item["Record ID"]}</div>
              <div className={itemAction}>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          );
        }}
        onChange={handleRLDDChange}
      /> */}
    </div>
  );
};
