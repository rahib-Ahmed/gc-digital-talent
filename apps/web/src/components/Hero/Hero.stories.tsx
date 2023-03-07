import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Hero from "./Hero";

export default {
  component: Hero,
  title: "Components/Hero",
  args: {
    title: "Hero",
    subtitle: "Subtitle",
    crumbs: [
      {
        label: "Home",
        url: "#home",
      },
      {
        label: "One",
        url: "#one",
      },
      {
        label: "Two",
        url: "#two",
      },
      {
        label: "Three",
        url: "#three",
      },
    ],
  },
} as ComponentMeta<typeof Hero>;

const Template: ComponentStory<typeof Hero> = (args) => <Hero {...args} />;

export const Default = Template.bind({});

export const WithImage = Template.bind({});
WithImage.args = {
  imgPath: "https://via.placeholder.com/500",
};

export const NoSubtitle = Template.bind({});
NoSubtitle.args = {
  subtitle: undefined,
};

export const Centered = Template.bind({});
Centered.args = {
  centered: true,
};

export const Overlap = Template.bind({});
Overlap.args = {
  centered: true,
  children: (
    <div
      data-h2-background-color="base(white)"
      data-h2-radius="base(rounded)"
      data-h2-padding="base(x2, x1)"
      data-h2-shadow="base(s)"
      data-h2-text-align="base(center)"
    >
      <p data-h2-font-size="base(h4)">Replace Me</p>
    </div>
  ),
};
