import React from "react";
import type { Meta, StoryFn } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import { PoolCandidateStatus } from "@gc-digital-talent/graphql";

import TrackApplications, { Application } from "./TrackApplications";

const mockApplications = fakePoolCandidates(20);

const activeRecruitments: Application[] = Object.values(PoolCandidateStatus)
  .filter((status) => status !== PoolCandidateStatus.Expired)
  .map((status, index) => {
    return {
      ...mockApplications[index],
      status,
      archivedAt: null,
      expiryDate: FAR_FUTURE_DATE,
    };
  });

const expiredRecruitments: Application[] = fakePoolCandidates(5).map(
  (application) => ({
    ...application,
    expiryDate: FAR_PAST_DATE,
  }),
);

export default {
  component: TrackApplications,
  args: {
    applications: [...activeRecruitments, ...expiredRecruitments],
  },
} as Meta;

const Template: StoryFn<typeof TrackApplications> = (args) => {
  return <TrackApplications {...args} />;
};

export const DefaultQualifiedRecruitments = Template.bind({});
export const NoQualifiedRecruitments = Template.bind({});
NoQualifiedRecruitments.args = {
  applications: [],
};
