/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { screen, within } from "@testing-library/react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import { NO_DECISION } from "~/utils/assessmentResults";

import AssessmentStepTracker, {
  AssessmentStepTrackerProps,
} from "./AssessmentStepTracker";
import { groupPoolCandidatesByStep, sortResultsAndAddOrdinal } from "./utils";
import {
  armedForcesCandidate,
  bookmarkedCandidate,
  firstByName,
  lastByFirstName,
  poolWithAssessmentSteps,
  priorityEntitlementCandidate,
  testCandidates,
  unassessedCandidate,
} from "./testData";

// This should always make the component visible
const defaultProps: AssessmentStepTrackerProps = {
  pool: poolWithAssessmentSteps,
};

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const renderAssessmentStepTracker = (
  overrideProps?: AssessmentStepTrackerProps,
) => {
  const props = {
    ...defaultProps,
    ...overrideProps,
  };
  return renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <AssessmentStepTracker {...props} />
    </GraphqlProvider>,
  );
};

describe("AssessmentStepTracker", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderAssessmentStepTracker();
    await axeTest(container);
  });

  it("should display candidates with the correct ordinals", () => {
    renderAssessmentStepTracker();

    expect(
      screen.getByRole("link", {
        name: `1. ${unassessedCandidate.user.firstName} ${unassessedCandidate.user.lastName}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `2. ${priorityEntitlementCandidate.user.firstName} ${priorityEntitlementCandidate.user.lastName}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `3. ${armedForcesCandidate.user.firstName} ${armedForcesCandidate.user.lastName}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `4. ${firstByName.user.firstName} No last name provided`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `5. ${lastByFirstName.user.firstName} ${lastByFirstName.user.lastName}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `6. ${bookmarkedCandidate.user.firstName} ${bookmarkedCandidate.user.lastName}`,
      }),
    ).toBeInTheDocument();
  });

  it("should group results by candidate", () => {
    renderAssessmentStepTracker();

    // Has two results but should only see one link for it
    expect(
      screen.getAllByRole("link", {
        name: new RegExp(
          `${unassessedCandidate.user.firstName} ${unassessedCandidate.user.lastName}`,
          "i",
        ),
      }),
    ).toHaveLength(1);
  });

  it("should display candidates in the correct order", () => {
    renderAssessmentStepTracker();

    const firstColumn = screen.getByRole("list", {
      name: /step 1/i,
    });

    const candidate1 = within(firstColumn).getByRole("link", {
      name: /bookmarked candidate/i,
    });
    const candidate2 = within(firstColumn).getByRole("link", {
      name: /unassessed candidate/i,
    });
    const candidate3 = within(firstColumn).getByRole("link", {
      name: /priority entitlement/i,
    });
    const candidate4 = within(firstColumn).getByRole("link", {
      name: /armed forces/i,
    });
    expect(candidate1.compareDocumentPosition(candidate2)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(candidate2.compareDocumentPosition(candidate3)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(candidate3.compareDocumentPosition(candidate4)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("should have a working sort function", () => {
    const steps = Array.from(
      groupPoolCandidatesByStep(
        unpackMaybes(poolWithAssessmentSteps.assessmentSteps),
        unpackMaybes(poolWithAssessmentSteps.poolCandidates),
      ),
    );
    const modifiedResults = sortResultsAndAddOrdinal(
      Array.from(steps[0].results),
    );

    expect(modifiedResults[0].poolCandidate.id).toEqual("bookmarked");
    expect(modifiedResults[0].ordinal).toEqual(6);
    expect(modifiedResults[1].poolCandidate.id).toEqual("unassessed");
    expect(modifiedResults[1].ordinal).toEqual(1);
    expect(modifiedResults[2].poolCandidate.id).toEqual("priority-entitlement");
    expect(modifiedResults[2].ordinal).toEqual(2);
    expect(modifiedResults[3].poolCandidate.id).toEqual("armed-forces");
    expect(modifiedResults[3].ordinal).toEqual(3);
    expect(modifiedResults[4].poolCandidate.id).toEqual("first-by-name");
    expect(modifiedResults[4].ordinal).toEqual(4);
    expect(modifiedResults[5].poolCandidate.id).toEqual("last-by-first-name");
    expect(modifiedResults[5].ordinal).toEqual(5);
  });

  it("should have working group function", () => {
    const groupedResults = groupPoolCandidatesByStep(
      unpackMaybes(poolWithAssessmentSteps.assessmentSteps),
      unpackMaybes(poolWithAssessmentSteps.poolCandidates),
    );
    const stepArray = Array.from(groupedResults.values());
    const { results } = stepArray[0];

    // One duplicate candidate accounted for
    expect(results.length).toEqual(testCandidates.length);

    // They are in the correct order
    const orderArray = Array.from(
      { length: stepArray.length },
      (x, i) => i + 1,
    );
    const stepOrder = stepArray
      .map((step) => step.step.sortOrder)
      .filter(notEmpty);
    expect(stepOrder).toEqual(orderArray);

    /**
     * This can be a little tricky to read. Expected shape:
     *
     * [
     *  {
     *    decision: "noDecision",
     *    poolCandidate: { id: "candidate-is-unassessed" },
     *  }
     * ]
     */
    expect(Array.from(results)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          decision: NO_DECISION,
          poolCandidate: expect.objectContaining({
            id: "unassessed",
          }),
        }),
      ]),
    );
  });
});
