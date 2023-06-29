import React from "react";

import Required from "./Required";

export type LabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  required?: boolean;
};

const Label = ({ required, children, ...props }: LabelProps) => (
  <label data-h2-font-size="base(caption)" {...props}>
    {children}
    <Required required={required} />
  </label>
);

export default Label;
