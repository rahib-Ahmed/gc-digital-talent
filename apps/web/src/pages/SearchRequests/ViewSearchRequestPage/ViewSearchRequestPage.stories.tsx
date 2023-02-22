import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

import { ViewSearchRequest } from "./components/ViewSearchRequest";

const mockSearchRequests = fakeSearchRequests();

export default {
  component: ViewSearchRequest,
  title: "Pages/View Search Request Page",
} as ComponentMeta<typeof ViewSearchRequest>;

const Template: ComponentStory<typeof ViewSearchRequest> = (args) => {
  const { searchRequest } = args;

  return <ViewSearchRequest searchRequest={searchRequest} />;
};

export const Default = Template.bind({});
Default.args = {
  searchRequest: mockSearchRequests[0],
};
