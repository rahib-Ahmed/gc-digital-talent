import React from "react";

export type PillSize = "sm" | "md" | "lg";
export type PillColor =
  | "primary"
  | "secondary"
  | "neutral"
  | "blue"
  | "green"
  | "error";
export type PillMode = "solid" | "outline";

export interface PillProps
  extends Omit<React.HTMLProps<HTMLSpanElement>, "size"> {
  /** The style type of the element. */
  color: PillColor;
  /** The style mode of the element. */
  mode: PillMode;
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  size?: PillSize;
}

const colorMap: Record<
  PillColor,
  Record<"solid" | "outline", Record<string, string>>
> = {
  primary: {
    solid: {
      "data-h2-border": "base(1px solid primary.dark)",
      "data-h2-background-color": "base(primary)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid primary.dark)",
      "data-h2-background-color": "base(primary.light.10)",
      "data-h2-color": "base(primary.dark)",
    },
  },
  secondary: {
    solid: {
      "data-h2-border": "base(1px solid secondary.dark)",
      "data-h2-background-color": "base(secondary.light)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid secondary.dark)",
      "data-h2-background-color": "base(secondary.light.10)",
      "data-h2-color": "base(secondary.dark)",
    },
  },
  blue: {
    solid: {
      "data-h2-border": "base(1px solid secondary.dark)",
      "data-h2-background-color": "base(secondary.light)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid secondary.dark)",
      "data-h2-background-color": "base(secondary.light.10)",
      "data-h2-color": "base(secondary.dark)",
    },
  },
  green: {
    solid: {
      "data-h2-border": "base(1px solid quinary.dark)",
      "data-h2-background-color": "base(quinary.light)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid quinary.dark)",
      "data-h2-background-color": "base(quinary.light.10)",
      "data-h2-color": "base(quinary.dark)",
    },
  },
  neutral: {
    solid: {
      /* not very visible - should probably be fixed before using */
      "data-h2-border": "base(1px solid gray.dark)",
      "data-h2-background-color": "base(gray.dark)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid gray.dark)",
      "data-h2-background-color": "base(gray.10)",
      "data-h2-color": "base(gray.dark)",
    },
  },
  error: {
    solid: {
      "data-h2-border": "base(1px solid error.dark)",
      "data-h2-background-color": "base(error.dark)",
      "data-h2-color": "base(white)",
    },
    outline: {
      "data-h2-border": "base(1px solid error.dark)",
      "data-h2-background-color": "base(error.light.10)",
      "data-h2-color": "base(black.dark)",
    },
  },
};

const sizeMap: Record<PillSize, Record<string, string>> = {
  sm: {
    "data-h2-font-size": "base(0.6rem)",
    "data-h2-padding": "base(x.1, x.25)",
  },
  md: {
    "data-h2-font-size": "base(caption)",
    "data-h2-padding": "base(x.25, x.75)",
  },
  lg: {
    "data-h2-font-size": "base(copy)",
    "data-h2-padding": "base(x.5, x1)",
  },
};

const Pill: React.FC<PillProps> = ({
  children,
  color,
  mode,
  size = "md",
  block = false,
  ...rest
}): React.ReactElement => {
  return (
    <span
      {...(block
        ? { "data-h2-display": "base(block)" }
        : { "data-h2-display": "base(inline-block)" })}
      data-h2-radius="base(m)"
      data-h2-font-size="base(caption)"
      {...colorMap[color][mode]}
      {...sizeMap[size]}
      data-h2-text-align="base(center)"
      data-h2-max-width="base(100%)"
      {...rest}
    >
      {children}
    </span>
  );
};

export default Pill;
