import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import Checklist from "./Checklist";

export default {
  component: Checklist,
};

const Template: StoryFn<typeof Checklist> = (args) => (
  <Form onSubmit={action("Submit Form")}>
    <Checklist {...args} />
    <Submit data-h2-margin-top="base(x1)" />
  </Form>
);

export const Default = Template.bind({});
Default.args = {
  idPrefix: "checklist",
  legend: "Which items do you want to check?",
  name: "checklist",
  items: [
    { value: "one", label: "Box One" },
    { value: "two", label: "Box Two" },
    { value: "three", label: "Box Three" },
  ],
  rules: { required: "All items must be checked!" },
};

Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      dark: allModes.dark,
    },
  },
};

export const DisabledChecklist = Template.bind({});
DisabledChecklist.args = {
  ...Default.args,
  disabled: true,
};
