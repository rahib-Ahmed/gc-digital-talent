import React from "react";
import type { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import {
  fakeAssessmentSteps,
  fakePoolCandidates,
  fakePools,
} from "@gc-digital-talent/fake-data";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";

import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultJustification,
  AssessmentResultType,
  AssessmentStep,
  AssessmentStepType,
  PoolCandidate,
} from "~/api/generated";

import AssessmentStepTracker from "./AssessmentStepTracker";

faker.seed(0);

let assessmentSteps: AssessmentStep[] = fakeAssessmentSteps(3);
assessmentSteps = [
  {
    ...assessmentSteps[0],
    type: AssessmentStepType.ApplicationScreening,
  },
  ...assessmentSteps.slice(1, 3),
];

const candidates: PoolCandidate[] = fakePoolCandidates(20).map((candidate) => {
  const furthestStep = faker.number.int({ min: 1, max: 3 });
  return {
    ...candidate,
    assessmentResults: Array.from<number>({ length: furthestStep }).map(
      (_, stepIndex) => ({
        id: faker.string.uuid(),
        assessmentStep: assessmentSteps[stepIndex],
        assessmentResultType: faker.helpers.arrayElement<AssessmentResultType>(
          Object.values(AssessmentResultType),
        ),
        assessmentDecision:
          faker.helpers.arrayElement<AssessmentDecision | null>([
            ...Object.values(AssessmentDecision),
            null,
          ]),
        assessmentResultJustification:
          faker.helpers.arrayElement<AssessmentResultJustification>(
            Object.values(AssessmentResultJustification),
          ),
        assessmentDecisionLevel:
          faker.helpers.arrayElement<AssessmentDecisionLevel>(
            Object.values(AssessmentDecisionLevel),
          ),
      }),
    ),
  };
});

let mockPool = fakePools(1)[0];
mockPool = {
  ...mockPool,
  assessmentSteps: assessmentSteps.map((step) => ({
    ...step,
    assessmentResults: candidates
      .filter(
        (candidate) =>
          candidate.assessmentResults?.some(
            (result) => result?.assessmentStep?.id === step.id,
          ),
      )
      .map((candidate) => ({
        id: faker.string.uuid(),
        ...candidate.assessmentResults?.find(
          (result) => result?.assessmentStep?.id === step.id,
        ),
        poolCandidate: candidate,
      })),
  })),
};

export default {
  component: AssessmentStepTracker,
  title: "Components/Assessment Step Tracker",
  decorators: [MockGraphqlDecorator],
  parameters: {
    apiResponsesConfig: {
      latency: {
        min: 500,
        max: 2000,
      },
    },
    apiResponses: {
      ToggleBookmark_Mutation: {
        data: {
          togglePoolCandidateBookmark: true,
        },
      },
    },
  },
};

const Template: StoryFn<typeof AssessmentStepTracker> = (args) => (
  <AssessmentStepTracker {...args} />
);

export const WithCandidates = Template.bind({});
WithCandidates.args = {
  pool: mockPool,
};

export const Empty = Template.bind({});
Empty.args = {
  pool: {
    ...mockPool,
    assessmentSteps,
  },
};
