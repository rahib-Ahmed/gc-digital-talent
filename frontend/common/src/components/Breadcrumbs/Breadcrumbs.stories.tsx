import React from "react";
import { Story, Meta } from "@storybook/react";
import Breadcrumbs from "./Breadcrumbs";
import type { BreadcrumbsProps } from "./Breadcrumbs";

export default {
  component: Breadcrumbs,
  title: "Components/Breadcrumbs",
  args: {
    links: [],
  },
} as Meta;

const BlackTemplateBreadcrumbs: Story<BreadcrumbsProps> = (args) => {
  return (
    <div data-h2-color="base(black)">
      <Breadcrumbs {...args} />
    </div>
  );
};

const WhiteTemplateBreadcrumbs: Story<BreadcrumbsProps> = (args) => {
  return (
    <div data-h2-color="base(white)" data-h2-background-color="base(black)">
      <Breadcrumbs {...args} />
    </div>
  );
};

export const BlackFontBreadcrumbs = BlackTemplateBreadcrumbs.bind({});
export const WhiteFontBreadcrumbs = WhiteTemplateBreadcrumbs.bind({});

BlackFontBreadcrumbs.args = {
  links: [
    {
      title: "My Name",
      href: "localnothost",
    },
    { title: "Not My Name", href: "nothost" },
    { title: "No Link" },
  ],
};

WhiteFontBreadcrumbs.args = {
  links: [
    {
      title: "My Name",
      href: "localnothost",
    },
    { title: "Not My Name", href: "nothost" },
    { title: "No Link" },
  ],
};
