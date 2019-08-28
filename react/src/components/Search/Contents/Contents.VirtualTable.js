import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import { AutoSizer, Column, Table } from "react-virtualized";
import { FileSearchContext } from "../../../context/Search.Context";
import { fetchScenesData } from "../../../util/scenes-search";
import { normalizeSize } from "../../../util/strings";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import Axios from "axios";
import { api_server } from "../../../environment/environment";
import useToggle from "../../../hooks/useToggle";
import ContentsDialog from "./Contents.Dialog";

const styles = theme => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box"
  },
  tableRow: {
    cursor: "pointer"
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200]
    }
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: "initial"
  }
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;

    return (
      <Tooltip title={columnIndex ? "Ctrl + click to view file details" : ""}>
        <TableCell
          component="div"
          className={clsx(classes.tableCell, classes.flexContainer, {
            [classes.noClick]: onRowClick == null
          })}
          variant="body"
          style={{ height: rowHeight }}
          align={
            (columnIndex != null && columns[columnIndex].numeric) || false
              ? "right"
              : "left"
          }
        >
          {columnIndex ? cellData : <Checkbox checked={cellData} />}
        </TableCell>
      </Tooltip>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const {
      headerHeight,
      columns,
      classes,
      allSelection,
      toggleAllSelection
    } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        {columnIndex ? (
          label
        ) : (
          <Checkbox
            onChange={toggleAllSelection}
            checked={allSelection === 1}
            indeterminate={allSelection === 0}
          />
        )}
      </TableCell>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      allSelection,
      toggleAllSelection,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            headerHeight={headerHeight}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({
                      ...headerProps,
                      allSelection,
                      toggleAllSelection,
                      columnIndex: index
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

let scrollDebounceTimer = null;
let startIndex = 0;

export default () => {
  const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  const {
    project,
    count,
    scenes,
    limit,
    skip,
    query,
    sort,
    selected
  } = searchFileProps;

  const [dialogOpen, toggleDialogOpen] = useToggle(false);
  const [viewScene, setViewScene] = useState({});

  useEffect(() => {
    fetchScenesData({ project, skip, limit, query, sort }, results =>
      searchFileDispatch({ ...results })
    );
  }, [selected, skip, limit, project, searchFileDispatch, query, sort]);

  const handleRowClick = ({ index, event }) => {
    const _index = index - skip;
    if (_index < scenes.length && _index >= 0) {
      const scene = scenes[_index];
      const sceneID = scene._id;
      if (event.ctrlKey) {
        setViewScene(scene);
        toggleDialogOpen();
      } else {
        const newSelected = selected.includes(sceneID)
          ? selected.filter(s => s !== sceneID)
          : [...selected, sceneID];
        searchFileDispatch({ selected: newSelected });
      }
    }
  };

  const handleFetchRow = ({ index }) => {
    startIndex = index > limit ? index - limit + 1 : 0;
    clearTimeout(scrollDebounceTimer);
    scrollDebounceTimer = setTimeout(() => {
      if (startIndex !== skip) {
        fetchScenesData(
          {
            project,
            skip: startIndex,
            limit,
            query,
            sort
          },
          results => searchFileDispatch({ ...results, skip: startIndex })
        );
      }
    }, 100);

    const _index = index - skip;
    const scene = _index >= 0 && _index < scenes.length ? scenes[_index] : {};

    return {
      ...scene,
      isSelected: Boolean(selected.length && selected.includes(scene._id)),
      size: scene.size ? normalizeSize(scene.size) : 0
    };
  };

  const evaluateSelections = () => {
    const selectedLen = selected.length;
    if (!selectedLen) {
      return -1;
    } else if (selectedLen < count) {
      return 0;
    } else if (selectedLen === count) {
      return 1;
    }
  };

  const toggleAllSelection = () => {
    const allSelectionState = evaluateSelections();
    if (allSelectionState === -1) {
      // if selection is empty
      const sortString = JSON.stringify(sort);
      const queryString = JSON.stringify(query);

      const selectAllURL = `${api_server}/search/${project}/ids-only/sort=${sortString}/query=${queryString}`;
      Axios.get(selectAllURL).then(results =>
        searchFileDispatch({ selected: results.data })
      );
    } else {
      // if selection is not empty
      searchFileDispatch({ selected: [] });
    }
  };

  return (
    <div style={{ flexGrow: 1, height: "100%", width: "100%" }}>
      <VirtualizedTable
        toggleAllSelection={toggleAllSelection}
        allSelection={evaluateSelections()}
        rowCount={count}
        onRowClick={handleRowClick}
        rowGetter={handleFetchRow}
        columns={[
          {
            width: 100,
            label: "Select",
            dataKey: "isSelected",
            numeric: false
          },
          {
            width: 1000,
            label: "File Name",
            dataKey: "fileName",
            numeric: false
          },
          {
            width: 120,
            label: "Type",
            dataKey: "extension",
            numeric: true
          },
          {
            width: 150,
            label: "Size",
            dataKey: "size",
            numeric: true
          }
        ]}
      />

      <ContentsDialog
        open={dialogOpen}
        toggleDialog={toggleDialogOpen}
        fileDetails={viewScene}
      />
    </div>
  );
};
