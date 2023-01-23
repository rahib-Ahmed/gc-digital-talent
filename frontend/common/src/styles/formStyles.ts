import { FieldState } from "../helpers/formUtils";

// Note: Expect this file to grow and include more than one export
// eslint-disable-next-line import/prefer-default-export
export const fieldStateStyles: Record<FieldState, Record<string, string>> = {
  unset: {
    "data-h2-border":
      "base(2px solid gray) base:focus-visible(2px solid secondary)",
    "data-h2-background-color": "base(white)",
    "data-h2-outline": "base(none)",
  },
  invalid: {
    "data-h2-border": "base(2px solid tm-red.dark)",
    "data-h2-background-color": "base(tm-red.lightest)",
  },
  dirty: {
    "data-h2-border": "base(2px solid secondary.dark)",
  },
};
