import { ButtonLinkMode, Color } from "../types";

type StyleRecord = Record<string, string>;

/**
 * Style exclusions
 *
 * Arrays of different modes that have specials
 * style use cases for specific attributes
 */
const styleExclusions: Record<string, Array<ButtonLinkMode>> = {
  background: ["cta", "inline"],
  border: ["cta", "inline"],
  color: ["cta"],
  padding: ["cta", "inline"],
};

/**
 * Fallback when a map has no key
 */
const emptyStyleRecord = {} as StyleRecord;

/**
 * Get Padding
 *
 * Compute a button or links padding based on its mode
 *
 * @param mode ButtonLinkMode
 * @returns Record<string, string>
 */
const getPadding = (mode: ButtonLinkMode): StyleRecord => {
  return styleExclusions.padding.includes(mode)
    ? {
        "data-h2-padding": "base(0)",
      }
    : {
        "data-h2-padding": "base(x.5, x1)",
      };
};

/**
 * Get Borders
 *
 * Compute a button or links borders based on its mode and colour
 *
 * @param mode ButtonLinkMode
 * @param color Color
 * @returns Record<string, string>
 */
const getBorders = (mode: ButtonLinkMode, color: Color): StyleRecord => {
  const borderColorMap = new Map<Color, Record<string, string>>([
    [
      "primary",
      {
        "data-h2-border-color":
          "base(primary.light) base:focus-visible(focus) base:dark(primary.light) base:dark:focus-visible(focus) base:admin(primary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "secondary",
      {
        "data-h2-border-color":
          "base(secondary) base:focus-visible(focus) base:dark(secondary) base:dark:focus-visible(focus) base:admin(secondary) base:admin:focus-visible(focus) base:admin:dark(secondary.lighter) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(secondary.light) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "tertiary",
      {
        "data-h2-border-color":
          "base(tertiary) base:focus-visible(focus) base:dark(tertiary) base:dark:focus-visible(focus) base:admin(tertiary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(tertiary.light) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "quaternary",
      {
        "data-h2-border-color":
          "base(quaternary) base:focus-visible(focus) base:dark(quaternary) base:dark:focus-visible(focus) base:admin(quaternary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(quaternary.light) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "quinary",
      {
        "data-h2-border-color":
          "base(quinary) base:focus-visible(focus) base:dark(quinary) base:dark:focus-visible(focus) base:admin(quinary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(quinary.light) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "success",
      {
        "data-h2-border-color":
          "base(success.light) base:focus-visible(focus) base:dark(success.light) base:dark:focus-visible(focus)",
      },
    ],
    [
      "warning",
      {
        "data-h2-border-color":
          "base(warning) base:focus-visible(focus) base:dark(warning) base:dark:focus-visible(focus)",
      },
    ],
    [
      "error",
      {
        "data-h2-border-color":
          "base(error.light) base:focus-visible(focus) base:dark(error.light) base:dark:focus-visible(focus)",
      },
    ],
    [
      "black",
      {
        "data-h2-border-color":
          "base(black) base:focus-visible(focus) base:dark:focus-visible(focus)",
      },
    ],
    [
      "white",
      {
        "data-h2-border-color":
          "base(white) base:focus-visible(focus) base:dark:focus-visible(focus)",
      },
    ],
  ]);

  const borderColor = borderColorMap.get(color);

  return styleExclusions.border.includes(mode)
    ? {}
    : {
        "data-h2-border-width": "base(3px)",
        "data-h2-border-style": "base(solid)",
        ...(borderColor ? { ...borderColor } : {}),
      };
};

type BackgroundMode = Omit<ButtonLinkMode, "cta" | "inline">;

/**
 * Get Background
 *
 * Compute a button or links background based on its mode and colour
 *
 * @param mode ButtonLinkMode
 * @param color Color
 * @returns Record<string, string>
 */
export const getBackground = (
  mode: ButtonLinkMode,
  color: Color,
): StyleRecord => {
  const primaryBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(primary.light) base:hover(primary.lightest) base:focus-visible(focus) base:dark(primary.light) base:dark:focus-visible(focus) base:admin(primary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(primary.lightest) base:hover(primary.lighter) base:focus-visible(focus) base:dark(primary.darker) base:dark:hover(primary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark:hover(primary.light) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
      },
    ],
  ]);

  const secondaryBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(secondary) base:hover(secondary.lightest) base:focus-visible(focus) base:dark(secondary) base:dark:focus-visible(focus) base:admin(secondary) base:admin:focus-visible(focus) base:admin:dark(secondary.lighter) base:admin:dark:hover(secondary.darkest) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(secondary.light) base:iap:dark:hover(secondary.darkest) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(secondary.lightest) base:hover(secondary.lighter) base:focus-visible(focus) base:dark(secondary.darker) base:dark:hover(secondary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(secondary) base:admin:dark:hover(secondary.lighter) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:hover(secondary) base:iap:dark:focus-visible(focus)",
      },
    ],
  ]);

  const tertiaryBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(tertiary) base:hover(tertiary.lightest) base:focus-visible(focus) base:dark(tertiary) base:dark:focus-visible(focus) base:admin(tertiary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(tertiary.light) base:iap:dark:hover(tertiary.darkest) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(tertiary.lightest) base:hover(tertiary.lighter) base:focus-visible(focus) base:dark(tertiary.darker) base:dark:hover(tertiary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(tertiary.darkest) base:admin:dark:hover(tertiary.darker) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:hover(tertiary) base:iap:dark:focus-visible(focus)",
      },
    ],
  ]);

  const quaternaryBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(quaternary) base:hover(quaternary.lightest) base:focus-visible(focus) base:dark(quaternary) base:dark:focus-visible(focus) base:admin(quaternary) base:admin(quaternary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(quaternary.light) base:iap:dark:hover(quaternary.darkest) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(quaternary.lightest) base:hover(quaternary.lighter) base:focus-visible(focus) base:dark(quaternary.darker) base:dark:hover(quaternary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(quaternary.darkest) base:admin:dark:hover(quaternary.darker) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:hover(quaternary) base:iap:dark:focus-visible(focus)",
      },
    ],
  ]);

  const quinaryBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(quinary) base:hover(quinary.lightest) base:focus-visible(focus) base:dark(quinary) base:dark:focus-visible(focus) base:admin(quinary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(quinary.light) base:iap:dark:hover(quinary.darkest) base:iap:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(quinary.lightest) base:hover(quinary.lighter) base:focus-visible(focus) base:dark(quinary.darker) base:dark:hover(quinary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(quinary.darkest) base:admin:dark:hover(quinary.darker) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:hover(quinary) base:iap:dark:focus-visible(focus)",
      },
    ],
  ]);

  const successBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(success.light) base:hover(success.lightest) base:focus-visible(focus) base:dark(success.light) base:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(success.lightest) base:hover(success.lighter) base:focus-visible(focus) base:dark(success.darker) base:dark:hover(success.dark) base:dark:focus-visible(focus)",
      },
    ],
  ]);

  const warningBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(warning) base:hover(warning.lightest) base:focus-visible(focus) base:dark(warning) base:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(warning.lightest) base:hover(warning.lighter) base:focus-visible(focus) base:dark(warning.darker) base:dark:hover(warning.dark) base:dark:focus-visible(focus)",
      },
    ],
  ]);

  const errorBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(error.light) base:hover(error.lightest) base:focus-visible(focus) base:dark(error.light) base:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(error.lightest) base:hover(error.lighter) base:focus-visible(focus) base:dark(error.darker) base:dark:hover(error.dark) base:dark:focus-visible(focus)",
      },
    ],
  ]);

  const blackBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(black) base:hover(black.lightest) base:focus-visible(focus) base:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(black.lightest) base:hover(black.lighter) base:focus-visible(focus) base:dark(white.darkest) base:dark:hover(white.darker) base:dark:focus-visible(focus)",
      },
    ],
  ]);

  const whiteBackgroundMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-background":
          "base(white) base:hover(black.light) base:focus-visible(focus) base:dark:focus-visible(focus)",
      },
    ],
    [
      "outline",
      {
        "data-h2-background":
          "base(white.darkest) base:hover(white.darker) base:focus-visible(focus) base:dark(black.lightest) base:dark:hover(black.lighter) base:dark:focus-visible(focus)",
      },
    ],
  ]);

  const backgroundMap = new Map<Color, StyleRecord>([
    ["primary", primaryBackgroundMap.get(mode) || emptyStyleRecord],
    ["secondary", secondaryBackgroundMap.get(mode) || emptyStyleRecord],
    ["tertiary", tertiaryBackgroundMap.get(mode) || emptyStyleRecord],
    ["quaternary", quaternaryBackgroundMap.get(mode) || emptyStyleRecord],
    ["quinary", quinaryBackgroundMap.get(mode) || emptyStyleRecord],
    ["success", successBackgroundMap.get(mode) || emptyStyleRecord],
    ["warning", warningBackgroundMap.get(mode) || emptyStyleRecord],
    ["error", errorBackgroundMap.get(mode) || emptyStyleRecord],
    ["black", blackBackgroundMap.get(mode) || emptyStyleRecord],
    ["white", whiteBackgroundMap.get(mode) || emptyStyleRecord],
  ]);

  const background = backgroundMap.get(color);

  return styleExclusions.background.includes(mode)
    ? {}
    : {
        ...(background ? { ...background } : {}),
      };
};

type FontColorMode = Omit<ButtonLinkMode, "cta">;

/**
 * Get Font Color
 *
 * Compute a button or links font color based on its mode and colour
 *
 * @param mode ButtonLinkMode
 * @param color Color
 * @returns Record<string, string>
 */
export const getFontColor = (
  mode: ButtonLinkMode,
  color: Color,
): StyleRecord => {
  const primaryFontColorMap = new Map<FontColorMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin(white) base:admin:hover(black) base:admin:focus-visible(black) base:admin:dark(white) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(primary.dark) base:hover(primary) base:focus-visible(black) base:dark(primary.lighter) base:dark:hover(primary.light) base:dark:focus-visible(black) base:admin(primary) base:admin:hover(primary.light) base:admin:focus-visible(black) base:admin:dark(primary.lighter) base:admin:dark:hover(primary.light) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      },
    ],
  ]);

  const secondaryFontColorMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin(white) base:admin:hover(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap(white) base:iap:hover(black) base:iap:focus-visible(black) base:iap:dark(white) base:iap:dark:hover(white) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(secondary.darker) base:hover(secondary) base:focus-visible(black) base:dark(secondary.lighter) base:dark:hover(secondary.light) base:dark:focus-visible(black) base:admin(secondary.light) base:admin:hover(secondary.lighter) base:admin:focus-visible(black) base:admin:dark(secondary.lightest) base:admin:dark:hover(secondary.lighter) base:admin:dark:focus-visible(black) base:iap:hover(secondary.light) base:iap:focus-visible(black) base:iap:dark:hover(secondary.light) base:iap:dark:focus-visible(black)",
      },
    ],
  ]);

  const tertiaryFontColorMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap(white) base:iap:hover(black) base:iap:focus-visible(black) base:iap:dark(white) base:iap:dark:hover(white) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(tertiary.dark) base:hover(tertiary) base:focus-visible(black) base:dark(tertiary.lighter) base:dark:hover(tertiary.light) base:dark:focus-visible(black) base:admin(tertiary.dark) base:admin:hover(tertiary) base:admin:focus-visible(black) base:admin:dark(tertiary.light) base:admin:dark:hover(tertiary) base:admin:dark:focus-visible(black) base:iap:hover(tertiary.light) base:iap:focus-visible(black) base:iap:dark:hover(tertiary.light) base:iap:dark:focus-visible(black)",
      },
    ],
  ]);

  const quaternaryFontColorMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap(white) base:iap:hover(black) base:iap:focus-visible(black) base:iap:dark(white) base:iap:dark:hover(white) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(quaternary.darker) base:hover(quaternary) base:focus-visible(black) base:dark(quaternary.lighter) base:dark:hover(quaternary.light) base:dark:focus-visible(black) base:admin(quaternary.dark) base:admin:hover(quaternary) base:admin:focus-visible(black) base:admin:dark(quaternary.light) base:admin:dark:hover(quaternary) base:admin:dark:focus-visible(black) base:iap:hover(quaternary.light) base:iap:focus-visible(black) base:iap:dark:hover(quaternary.light) base:iap:dark:focus-visible(black)",
      },
    ],
  ]);

  const quinaryFontColorMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap(white) base:iap:hover(black) base:iap:focus-visible(black) base:iap:dark(white) base:iap:dark:hover(white) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(quinary.darker) base:hover(quinary.dark) base:focus-visible(black) base:dark(quinary.lighter) base:dark:hover(quinary.light) base:dark:focus-visible(black) base:admin(quinary.dark) base:admin:hover(quinary) base:admin:focus-visible(black) base:admin:dark(quinary.light) base:admin:dark:hover(quinary) base:admin:dark:focus-visible(black) base:iap:hover(quinary.light) base:iap:focus-visible(black) base:iap:dark:hover(quinary.light) base:iap:dark:focus-visible(black)",
      },
    ],
  ]);

  const successFontColorMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(success.dark) base:hover(success.light) base:focus-visible(black) base:dark(success.lighter) base:dark:hover(success.light) base:dark:focus-visible(black)",
      },
    ],
  ]);

  const warningFontColorMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(warning.darker) base:hover(warning.dark) base:focus-visible(black) base:dark(warning.lighter) base:dark:hover(warning.light) base:dark:focus-visible(black)",
      },
    ],
  ]);

  const errorFontColorMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(error.dark) base:hover(error) base:focus-visible(black) base:dark(error.lighter) base:dark:hover(error.light) base:dark:focus-visible(black)",
      },
    ],
  ]);

  const blackFontColorMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(white) base:hover(black) base:focus-visible(black) base:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(black) base:hover(black.light) base:focus-visible(black) base:dark:focus-visible(black)",
      },
    ],
  ]);

  const whiteFontColorMap = new Map<BackgroundMode, StyleRecord>([
    [
      "solid",
      {
        "data-h2-color":
          "base(black) base:hover(white) base:focus-visible(black) base:dark:focus-visible(black)",
      },
    ],
    [
      "outline",
      {
        "data-h2-color":
          "base(white) base:focus-visible(black) base:dark(black) base:dark:focus-visible(black)",
      },
    ],
    [
      "inline",
      {
        "data-h2-color":
          "base(white) base:hover(white.dark) base:focus-visible(black) base:dark:focus-visible(black)",
      },
    ],
  ]);

  const fontColorMap = new Map<Color, StyleRecord>([
    ["primary", primaryFontColorMap.get(mode) || emptyStyleRecord],
    ["secondary", secondaryFontColorMap.get(mode) || emptyStyleRecord],
    ["tertiary", tertiaryFontColorMap.get(mode) || emptyStyleRecord],
    ["quaternary", quaternaryFontColorMap.get(mode) || emptyStyleRecord],
    ["quinary", quinaryFontColorMap.get(mode) || emptyStyleRecord],
    ["success", successFontColorMap.get(mode) || emptyStyleRecord],
    ["warning", warningFontColorMap.get(mode) || emptyStyleRecord],
    ["error", errorFontColorMap.get(mode) || emptyStyleRecord],
    ["black", blackFontColorMap.get(mode) || emptyStyleRecord],
    ["white", whiteFontColorMap.get(mode) || emptyStyleRecord],
  ]);

  const fontColor = fontColorMap.get(color);

  return styleExclusions.color.includes(mode)
    ? {}
    : {
        ...(fontColor ? { ...fontColor } : {}),
      };
};

/**
 * Get Block
 *
 * Compute a button or links display
 *
 * @param block boolean
 * @returns Record<string, string>
 */
const getBlock = (block?: boolean): StyleRecord => {
  return block
    ? {
        "data-h2-display": "base(block)",
        "data-h2-text-align": "base(center)",
        "data-h2-width": "base(100%)",
      }
    : { "data-h2-display": "base(inline-block)" };
};

interface UseCommonButtonLinkStylesArgs {
  mode: ButtonLinkMode;
  color: Color;
  block?: boolean;
}

type UseCommonButtonLinkStyles = (
  args: UseCommonButtonLinkStylesArgs,
) => Record<string, string>;

const useCommonButtonLinkStyles: UseCommonButtonLinkStyles = ({
  mode,
  color,
  block,
}) => {
  return {
    "data-h2-font-weight": "base(700)",
    "data-h2-radius": "base(s)",
    "data-h2-font-size": "base(copy)",
    "data-h2-transition": "base(.1s ease-in-out)",
    ...getPadding(mode),
    ...getBorders(mode, color),
    ...getBlock(block),
    ...getBackground(mode, color),
    ...getFontColor(mode, color),
  };
};

export default useCommonButtonLinkStyles;
