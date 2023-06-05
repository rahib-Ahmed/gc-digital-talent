import React from "react";
import { StoryFn } from "@storybook/react";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";

import Link from "./Link";
import type { LinkProps } from "./Link";
import { Color } from "../../types";

export default {
  component: Link,
  title: "Components/Link",
  args: {
    label: "Link Label",
  },
  argTypes: {
    label: {
      name: "label",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
  },
};

const colors: Array<Color> = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
];
const stoplight: Array<Color> = ["success", "warning", "error"];
const black: Array<Color> = ["black"];
const white: Array<Color> = ["white"];

type Story = StoryFn<Omit<LinkProps, "ref"> & { label: string }>;

const TemplateLink: Story = (args) => {
  const { label, ...rest } = args;

  return (
    <Link {...rest}>
      <span>{label}</span>
    </Link>
  );
};

const TemplateLinkColors: Story = (args) => {
  const { label, ...rest } = args;
  return (
    <div data-h2-display="base(flex)">
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {colors.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Link color={color} {...rest}>
              <span>{label}</span>
            </Link>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {stoplight.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Link color={color} {...rest}>
              <span>{label}</span>
            </Link>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {black.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Link color={color} {...rest}>
              <span>{label}</span>
            </Link>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(black)">
        {white.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Link color={color} {...rest}>
              <span>{label}</span>
            </Link>
          </p>
        ))}
      </div>
    </div>
  );
};

export const LinkDefault = TemplateLink.bind({});

export const LinkButtonSolid = TemplateLinkColors.bind({});
LinkButtonSolid.args = {
  mode: "solid",
};

export const LinkButtonOutline = TemplateLinkColors.bind({});
LinkButtonOutline.args = {
  mode: "outline",
};

export const LinkButtonCallToAction = TemplateLinkColors.bind({});
LinkButtonCallToAction.args = {
  mode: "cta",
  icon: InformationCircleIcon,
};

export const LinkButtonBlock = TemplateLink.bind({});
LinkButtonBlock.args = {
  mode: "solid",
  block: true,
};

export const IconLink = TemplateLink.bind({});
IconLink.args = {
  mode: "solid",
  icon: InformationCircleIcon,
};

export const ExternalLinkNewTab = TemplateLink.bind({});
ExternalLinkNewTab.args = {
  newTab: true,
  mode: "inline",
  href: "https://example.com",
};

export const ExternalLinkNotNewTab = TemplateLink.bind({});
ExternalLinkNotNewTab.args = {
  newTab: false,
  mode: "inline",
  href: "https://example.com",
};
