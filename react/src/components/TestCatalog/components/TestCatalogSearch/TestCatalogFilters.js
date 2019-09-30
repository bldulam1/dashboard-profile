import React, { useContext } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, FormControlLabel } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import { fetchData } from "../../../../util/test-catalog";
import uuid from "uuid/v4";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%"
  },
  formControlWrapper: {
    width: "50%"
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default () => {
  const { tcProps, tcDispatch } = useContext(TestCatalogContext);
  const {
    project,
    page,
    rowsPerPage,
    features,
    selectedFeatures,
    subFeatures,
    selectedSubFeatures,
    cols,
    visibleColumns
  } = tcProps;
  const classes = useStyles;
  function handleFeaturesChange(event) {
    const newFeatures = event.target.value;

    const query = newFeatures.length
      ? {
          $or: newFeatures.map(sn => ({
            sheetName: { $regex: sn, $options: "i" }
          }))
        }
      : {};

    fetchData({ project, page, rowsPerPage, query }, res => {
      tcDispatch({
        ...res,
        selectedSubFeatures: [],
        selectedFeatures: newFeatures,
        query
      });
    });
  }

  function handleSubFeaturesChange(event) {
    const newSubFeatures = event.target.value;
    const query = newSubFeatures.length
      ? {
          $or: newSubFeatures.map(sn => ({
            sheetName: sn
          }))
        }
      : {
          $or: selectedFeatures.map(sn => ({
            sheetName: { $regex: sn, $options: "i" }
          }))
        };

    fetchData({ project, page, rowsPerPage, query }, res => {
      tcDispatch({
        ...res,
        selectedSubFeatures: newSubFeatures,
        query
      });
    });
  }

  function handleVisibleColumnsChange(column, isVisible) {
    const newVisibleColumns = isVisible
      ? [...visibleColumns].filter(vc => vc !== column)
      : [...visibleColumns, column];
    tcDispatch({
      visibleColumns: newVisibleColumns
    });
  }
  return (
    <div className={classes.root}>
      <FormControl fullWidth>
        <InputLabel htmlFor="select-sheets">Features</InputLabel>
        <Select
          multiple
          value={selectedFeatures}
          onChange={handleFeaturesChange}
          input={<Input id="select-sheets" fullWidth />}
          renderValue={selected => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {features.map(sheetName => (
            <MenuItem key={sheetName} value={sheetName}>
              <Checkbox checked={selectedFeatures.indexOf(sheetName) > -1} />
              <ListItemText primary={sheetName} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel htmlFor="select-subfeatures">Subfeatures</InputLabel>
        <Select
          multiple
          value={selectedSubFeatures}
          onChange={handleSubFeaturesChange}
          input={<Input id="select-subfeatures" fullWidth />}
          renderValue={selected => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {subFeatures.map(sf => (
            <MenuItem key={sf} value={sf}>
              <Checkbox checked={selectedSubFeatures.indexOf(sf) > -1} />
              <ListItemText primary={sf} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {cols.map(col => {
          const isVisible = visibleColumns.includes(col.id);
          return (
            <FormControlLabel
              key={uuid()}
              control={
                <Checkbox
                  value={col.id}
                  checked={isVisible}
                  onChange={() => handleVisibleColumnsChange(col.id, isVisible)}
                />
              }
              label={col.label}
            />
          );
        })}
      </div>
    </div>
  );
};
