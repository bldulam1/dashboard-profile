import React, { Fragment } from "react";
import RootPaths from "./Operation.Components/Root.Paths";
import SIMSOperation from "./Operation.Components/SIMS.Operation";
import IDW4ConversionOperation from "./Operation.Components/IDW4Conversion.Operation";

export default () => {
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Fragment>
      <RootPaths handleExpanChange={handleChange} expanded={expanded} />
      <SIMSOperation handleExpanChange={handleChange} expanded={expanded} />
      <IDW4ConversionOperation handleExpanChange={handleChange} expanded={expanded} />
    </Fragment>
  );
};
