import React, { Fragment, useContext } from "react";
import RootPaths from "./Operation.Components/Root.Paths";
import SIMSOperation from "./Operation.Components/SIMS.Operation";
import IDW4ConversionOperation from "./Operation.Components/IDW4Conversion.Operation";
import FileSplittingOperation from "./Operation.Components/FileSplitting.Operation";
import { ProjectContext } from "../../../context/Project.Context";
import ExportOperation from "./Operation.Components/Export.Operation";
import CVWConversionOperation from "./Operation.Components/CVWConversion.Operation";
import HILRunOperation from "./Operation.Components/HILRun.Operation";
// import ContentsMapView from "../Contents/Contents.MapView";

export default () => {
  const [expanded, setExpanded] = React.useState(null);
  const { activeProject } = useContext(ProjectContext);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Fragment>
      <RootPaths handleExpanChange={handleChange} expanded={expanded} />
      <ExportOperation handleExpanChange={handleChange} expanded={expanded} />

      {["Subaru 77GHz", "Renault Nissan", "Nissan L53H"].includes(
        activeProject
      ) && (
        <Fragment>
          <SIMSOperation handleExpanChange={handleChange} expanded={expanded} />
          <CVWConversionOperation
            handleExpanChange={handleChange}
            expanded={expanded}
          />
          <HILRunOperation
            handleExpanChange={handleChange}
            expanded={expanded}
          />
        </Fragment>
      )}

      {["Subaru SVS"].includes(activeProject) && (
        <Fragment>
          <IDW4ConversionOperation
            handleExpanChange={handleChange}
            expanded={expanded}
          />
          <FileSplittingOperation
            handleExpanChange={handleChange}
            expanded={expanded}
          />
        </Fragment>
      )}
    </Fragment>
  );
};
