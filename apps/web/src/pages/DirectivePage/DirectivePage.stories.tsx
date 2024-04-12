import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import DirectivePage from "./DirectivePage";

export default {
  component: DirectivePage,
  title: "Pages/Directive on Digital Talent",
} as Meta;

const Template: StoryFn<typeof DirectivePage> = () => <DirectivePage />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
