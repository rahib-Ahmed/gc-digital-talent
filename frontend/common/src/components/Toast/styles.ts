import { TypeOptions } from "react-toastify";

export const iconStyles = {
  "data-h2-width": "base(x2)",
};

export const closeButtonStyles: Record<TypeOptions, Record<string, string>> = {
  default: {
    "data-h2-background-color":
      "base(transparent) base:hover(black.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(black.darker)  base:focus-visible(black)",
  },
  success: {
    "data-h2-background-color":
      "base(transparent) base:hover(tm-green.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(tm-green.darker)  base:focus-visible(black)",
  },
  warning: {
    "data-h2-background-color":
      "base(transparent) base:hover(warning.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(warning.darker)  base:focus-visible(black)",
  },
  info: {
    "data-h2-background-color":
      "base(transparent) base:hover(secondary.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(secondary.darker)  base:focus-visible(black)",
  },
  error: {
    "data-h2-background-color":
      "base(transparent) base:hover(tertiary.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(tertiary.darker)  base:focus-visible(black)",
  },
};
