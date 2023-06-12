import React from "react";
import type { Meta, Story } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "storybook-helpers";

import NestedLanguageProvider from "@gc-digital-talent/i18n/src/components/NestedLanguageProvider";

import { Messages } from "@gc-digital-talent/i18n";
import * as micMessages from "~/lang/micCompiled.json";
import { Home } from "./Home";

const messages: Map<string, Messages> = new Map([["mic", micMessages]]);

export default {
  component: Home,
  title: "Pages/Home Page/IAP",
  parameters: {
    backgrounds: {
      default: "white",
      values: [{ name: "white", value: "#fff" }],
    },
    themeKey: "iap", // Set the default theme to IAP
  },
} as Meta;

const Template: Story = () => (
  <NestedLanguageProvider messages={messages}>
    <Home />
  </NestedLanguageProvider>
);

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
};
