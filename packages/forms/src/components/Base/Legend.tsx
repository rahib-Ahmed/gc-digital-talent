import React from "react";

import Required from "./Required";

type LegendProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLLegendElement>,
  HTMLLegendElement
> & {
  required?: boolean;
};

const Legend = ({ required, children, ...props }: LegendProps) => (
  <legend
    data-h2-position="base(absolute)"
    data-h2-left="base(0)"
    data-h2-top="base(-x1.25)"
    {...props}
  >
    {children}
    <Required required={required} />
  </legend>
);

export default Legend;
