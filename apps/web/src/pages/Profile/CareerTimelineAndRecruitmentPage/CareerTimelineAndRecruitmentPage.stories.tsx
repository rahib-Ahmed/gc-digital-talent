import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { fakeExperiences } from "@gc-digital-talent/fake-data";

import CareerTimelineAndRecruitment from "./components/CareerTimelineAndRecruitment";

export default {
  title: "Pages/Career timeline and recruitment",
  args: {
    userId: "test",
  },
} as Meta<typeof CareerTimelineAndRecruitment>;

const CareerTimelineAndRecruitmentTemplate: StoryFn<
  typeof CareerTimelineAndRecruitment
> = (args) => {
  return <CareerTimelineAndRecruitment {...args} />;
};

export const NoExperiences = CareerTimelineAndRecruitmentTemplate.bind({});
export const WithExperiences = CareerTimelineAndRecruitmentTemplate.bind({});
export const NoExperiencesMissingSkills =
  CareerTimelineAndRecruitmentTemplate.bind({});
export const WithExperiencesMissingSkills =
  CareerTimelineAndRecruitmentTemplate.bind({});

const mockExperiences = fakeExperiences(10);

NoExperiences.args = {
  experiences: [],
};

WithExperiences.args = {
  experiences: mockExperiences,
};
