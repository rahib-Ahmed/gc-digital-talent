import React from "react";

import { Link } from "@gc-digital-talent/ui";

export interface StepProps {
  path: string;
  label: React.ReactNode;
  disabled?: boolean;
}

const Step = ({ path, label, disabled, ...rest }: StepProps) => (
  <Link
    href={path}
    mode={disabled ? "solid" : "outline"}
    type="button"
    color="black"
    disabled={disabled}
    {...rest}
  >
    {label}
  </Link>
);

export default Step;
