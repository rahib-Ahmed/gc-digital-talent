/**
 * This file contains utility functions for working with the Pool Candidate model generally,
 * and for interacting with Pool Candidates on the Admin side (e.g. Assessment).
 *
 * For utilities specific to the Applicant-side UI, see ./applicationUtils.ts
 */
import { IntlShape, MessageDescriptor, defineMessages } from "react-intl";
import { isPast } from "date-fns/isPast";
import sortBy from "lodash/sortBy";
import { ReactNode } from "react";

import {
  formatDate,
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";
import {
  commonMessages,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import { Color } from "@gc-digital-talent/ui";
import {
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultType,
  AssessmentStep,
  AssessmentStepType,
  PoolCandidate,
  PoolSkillType,
  Maybe,
  PoolCandidateStatus,
  PublishingGroup,
  PriorityWeight,
  OverallAssessmentStatus,
  AssessmentResultStatus,
} from "@gc-digital-talent/graphql";
import { getOrThrowError } from "@gc-digital-talent/helpers";

import poolCandidateMessages from "~/messages/poolCandidateMessages";
import {
  QUALIFIED_STATUSES,
  DISQUALIFIED_STATUSES,
  REMOVED_STATUSES,
  TO_ASSESS_STATUSES,
  PLACED_STATUSES,
  NOT_PLACED_STATUSES,
  DRAFT_STATUSES,
  INACTIVE_STATUSES,
  SCREENED_OUT_STATUSES,
} from "~/constants/poolCandidate";

import { isOngoingPublishingGroup } from "./poolUtils";
import { NO_DECISION, NullableDecision } from "./assessmentResults";

export const isDisqualifiedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? DISQUALIFIED_STATUSES.includes(status) : false);

export const isRemovedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? REMOVED_STATUSES.includes(status) : false);

export const isQualifiedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? QUALIFIED_STATUSES.includes(status) : false);

export const isDraftStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? DRAFT_STATUSES.includes(status) : false);

export const isToAssessStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? TO_ASSESS_STATUSES.includes(status) : false);

export const isPlacedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? PLACED_STATUSES.includes(status) : false);

export const isNotPlacedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? NOT_PLACED_STATUSES.includes(status) : false);

export const isScreenedOutStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? SCREENED_OUT_STATUSES.includes(status) : false);

export const isInactiveStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? INACTIVE_STATUSES.includes(status) : false);

export const isSuspendedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
  suspendedAt: PoolCandidate["suspendedAt"],
): boolean => {
  const isSuspended = suspendedAt && new Date() > parseDateTimeUtc(suspendedAt);

  return !!(isSuspended && status === PoolCandidateStatus.QualifiedAvailable);
};

export const getRecruitmentType = (
  publishingGroup: Maybe<PublishingGroup> | undefined,
  intl: IntlShape,
) =>
  isOngoingPublishingGroup(publishingGroup)
    ? intl.formatMessage(poolCandidateMessages.ongoingRecruitment)
    : intl.formatMessage(poolCandidateMessages.targetedRecruitment);

export const isDraft = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => {
  return status === PoolCandidateStatus.Draft;
};

export const isExpired = (
  status: Maybe<PoolCandidateStatus> | undefined,
  expirationDate: Maybe<string> | undefined,
): boolean => {
  if (status === PoolCandidateStatus.Expired) {
    return true;
  }
  return expirationDate ? isPast(parseDateTimeUtc(expirationDate)) : false;
};

export const formatClosingDate = (
  closingDate: Maybe<string>,
  intl: IntlShape,
): string => {
  return closingDate
    ? relativeClosingDate({
        closingDate: parseDateTimeUtc(closingDate),
        intl,
      })
    : "";
};

export const formatSubmittedAt = (
  submittedAt: Maybe<string>,
  intl: IntlShape,
): string => {
  return submittedAt
    ? formatDate({
        date: parseDateTimeUtc(submittedAt),
        formatString: "PPP p",
        intl,
      })
    : "";
};

export const getResultsDecision = (
  step: AssessmentStep,
  results?: AssessmentResult[],
): NullableDecision => {
  if (!results) return NO_DECISION;
  let hasFailure: boolean = false;
  let hasOnHold: boolean = false;
  let hasToAssess: boolean = false;

  const stepResults = results.filter((result) => {
    return result.assessmentStep?.id === step.id;
  });

  if (stepResults.length === 0) {
    hasToAssess = true;
  }

  const requiredSkillAssessments = step.poolSkills?.filter(
    (poolSkill) => poolSkill?.type === PoolSkillType.Essential,
  );

  requiredSkillAssessments?.forEach((skillAssessment) => {
    const assessmentResults = stepResults.filter((result) => {
      return result.poolSkill?.id === skillAssessment?.id;
    });

    if (assessmentResults.length === 0) {
      hasToAssess = true;
      return;
    }

    assessmentResults.forEach((assessmentResult) => {
      switch (assessmentResult.assessmentDecision) {
        case null:
        case undefined:
          hasToAssess = true;
          break;
        case AssessmentDecision.Hold:
          hasOnHold = true;
          break;
        case AssessmentDecision.Unsuccessful:
          hasFailure = true;
          break;
        default:
      }
    });
  });

  // Check for Education requirement if this is an ApplicationScreening step
  if (step.type === AssessmentStepType.ApplicationScreening) {
    const educationResults = stepResults.filter(
      (result) =>
        result.assessmentResultType === AssessmentResultType.Education,
    );
    if (educationResults.length === 0) {
      hasToAssess = true;
    }
    educationResults.forEach((result) => {
      // Any "to assess" should be marked
      if (result.assessmentDecision === null) {
        hasToAssess = true;
      }
      switch (result.assessmentDecision) {
        case null:
          hasToAssess = true;
          break;
        case AssessmentDecision.Hold:
          hasOnHold = true;
          break;
        case AssessmentDecision.Unsuccessful:
          hasFailure = true;
          break;
        default:
      }
    });
  }

  if (hasFailure) {
    return AssessmentDecision.Unsuccessful;
  }
  if (hasToAssess) {
    return NO_DECISION;
  }
  if (hasOnHold) {
    return AssessmentDecision.Hold;
  }

  return AssessmentDecision.Successful;
};

export type ResultDecisionCounts = Record<NullableDecision, number>;
export type PoolCandidateId = string;
export type AssessmentStepId = string;

export const getOrderedSteps = (assessmentSteps: AssessmentStep[]) =>
  sortBy(assessmentSteps, (step) => step.sortOrder);

const getFinalDecisionChipColor = (
  status?: Maybe<PoolCandidateStatus>,
): Color => {
  if (isToAssessStatus(status)) {
    return "warning";
  }

  if (isDisqualifiedStatus(status)) {
    return "error";
  }

  if (isRemovedStatus(status)) {
    return "black";
  }

  if (isQualifiedStatus(status)) {
    return "success";
  }

  return "white";
};

export const statusToJobPlacement = (status?: Maybe<PoolCandidateStatus>) => {
  if (status) {
    if (isNotPlacedStatus(status)) {
      return poolCandidateMessages.notPlaced;
    }

    if (isPlacedStatus(status)) {
      return getPoolCandidateStatus(status);
    }
  }

  return commonMessages.notAvailable;
};

// Note: By setting the explicit Record<PoolCandidateStatus, x> type, Typescript will actually error if we forget a status!
const statusToChipMessageMapping: Record<
  PoolCandidateStatus,
  MessageDescriptor | MessageDescriptor[]
> = {
  [PoolCandidateStatus.Draft]: poolCandidateMessages.toAssess,
  [PoolCandidateStatus.DraftExpired]: poolCandidateMessages.toAssess,
  [PoolCandidateStatus.NewApplication]: poolCandidateMessages.toAssess,
  [PoolCandidateStatus.ApplicationReview]: poolCandidateMessages.toAssess,
  [PoolCandidateStatus.ScreenedIn]: poolCandidateMessages.toAssess,
  [PoolCandidateStatus.UnderAssessment]: poolCandidateMessages.toAssess,

  [PoolCandidateStatus.ScreenedOutApplication]:
    poolCandidateMessages.disqualified,
  [PoolCandidateStatus.ScreenedOutAssessment]:
    poolCandidateMessages.disqualified,

  [PoolCandidateStatus.QualifiedAvailable]: poolCandidateMessages.qualified,
  [PoolCandidateStatus.PlacedCasual]: poolCandidateMessages.qualified,
  [PoolCandidateStatus.PlacedTerm]: poolCandidateMessages.qualified,
  [PoolCandidateStatus.PlacedIndeterminate]: poolCandidateMessages.qualified,
  [PoolCandidateStatus.PlacedTentative]: poolCandidateMessages.qualified,

  [PoolCandidateStatus.ScreenedOutNotInterested]: [
    commonMessages.removed,
    commonMessages.dividingColon,
    poolCandidateMessages.toAssess,
  ],
  [PoolCandidateStatus.ScreenedOutNotResponsive]: [
    commonMessages.removed,
    commonMessages.dividingColon,
    poolCandidateMessages.toAssess,
  ],
  [PoolCandidateStatus.QualifiedUnavailable]: [
    commonMessages.removed,
    commonMessages.dividingColon,
    poolCandidateMessages.qualified,
  ],
  [PoolCandidateStatus.QualifiedWithdrew]: [
    commonMessages.removed,
    commonMessages.dividingColon,
    poolCandidateMessages.qualified,
  ],
  [PoolCandidateStatus.Expired]: [
    poolCandidateMessages.expired,
    commonMessages.dividingColon,
    poolCandidateMessages.qualified,
  ],
  [PoolCandidateStatus.Removed]: commonMessages.removed,
};

/**
 * The inAssessment statuses have extra business logic for deciding how to present the status chip,
 * since the candidate may or may not be ready for a final decision.
 */
const computeInAssessmentStatusChip = (
  assessmentStatus: Maybe<AssessmentResultStatus> | undefined,
  intl: IntlShape,
): StatusChip => {
  if (!assessmentStatus?.overallAssessmentStatus) {
    // This escape hatch mostly applies to Pools created before Record of Decision.
    return {
      label: intl.formatMessage(poolCandidateMessages.toAssess),
      color: "warning",
    };
  }

  if (
    assessmentStatus?.overallAssessmentStatus ===
    OverallAssessmentStatus.Disqualified
  ) {
    return {
      label:
        intl.formatMessage(poolCandidateMessages.disqualified) +
        intl.formatMessage(commonMessages.dividingColon) +
        intl.formatMessage(poolCandidateMessages.pendingDecision),
      color: "error",
    };
  }

  const currentStep =
    typeof assessmentStatus?.currentStep === "undefined"
      ? 1
      : assessmentStatus.currentStep;

  // currentStep of null means that the candidate has passed all steps and is tentatively qualified!
  if (currentStep === null) {
    return {
      label:
        intl.formatMessage(poolCandidateMessages.qualified) +
        intl.formatMessage(commonMessages.dividingColon) +
        intl.formatMessage(poolCandidateMessages.pendingDecision),
      color: "success",
    };
  }

  return {
    label:
      intl.formatMessage(poolCandidateMessages.toAssess) +
      intl.formatMessage(commonMessages.dividingColon) +
      intl.formatMessage(
        {
          defaultMessage: "Step {currentStep}",
          id: "RiGj9w",
          description: "Label for the candidates current assessment step",
        },
        {
          currentStep,
        },
      ),
    color: "warning",
  };
};

type StatusChip = {
  color: Color;
  label: ReactNode;
};

export const getCandidateStatusChip = (
  status: Maybe<PoolCandidateStatus> | undefined,
  assessmentStatus: Maybe<AssessmentResultStatus> | undefined,
  intl: IntlShape,
): StatusChip => {
  if (isToAssessStatus(status)) {
    return computeInAssessmentStatusChip(assessmentStatus, intl);
  }
  const messages =
    statusToChipMessageMapping[status ?? PoolCandidateStatus.NewApplication];
  const label = Array.isArray(messages)
    ? messages.reduce(
        (combined, item) => combined + intl.formatMessage(item),
        "",
      )
    : intl.formatMessage(messages);
  return {
    label,
    color: getFinalDecisionChipColor(status),
  };
};

/* Applicant facing statuses */

// Map combined statuses to their labels
const combinedStatusLabels = defineMessages({
  DRAFT: {
    defaultMessage: "Continue draft",
    id: "pf3KKo",
    description: "Link text to continue a application draft",
  },
  RECEIVED: {
    defaultMessage: "Application received",
    id: "4TmwRU",
    description: "Status for an application that has been submitted",
  },
  UNDER_REVIEW: {
    defaultMessage: "Application under review",
    id: "aagbij",
    description: "Status for an application that is being reviewed",
  },
  PENDING_SKILLS: {
    defaultMessage: "Application pending assessment",
    id: "UZWLKn",
    description: "Status for an application that is having skills reviewed",
  },
  ASSESSMENT: {
    defaultMessage: "Application pending assessment",
    id: "9Pxjw5",
    description:
      "Status for an application that where applicant is being assessed",
  },
  DATE_PASSED: {
    defaultMessage: "Submission date passed",
    id: "13fSK+",
    description:
      "Status for an application that where the recruitment has expired",
  },
  EXPIRED: {
    defaultMessage: "Expired",
    id: "GIC6EK",
    description: "Expired status",
  },
  HIRED_CASUAL: {
    defaultMessage: "Hired (Casual)",
    id: "0YZeO0",
    description:
      "Status for an application that has been hired with a casual contract",
  },
  NOT_INTERESTED: {
    defaultMessage: "Not interested",
    id: "c+6rQB",
    description: "Status for when the user has suspended an application",
  },
  HIRED_INDETERMINATE: {
    defaultMessage: "Hired (Indeterminate)",
    id: "/Sobod",
    description:
      "Status for an application that has been hired with an indeterminate contract",
  },
  HIRED_TERM: {
    defaultMessage: "Hired (Term)",
    id: "VplMpm",
    description:
      "Status for an application that has been hired with a term contract",
  },
  READY_TO_HIRE: {
    defaultMessage: "Ready to hire",
    id: "9gpVCX",
    description: "Status for an application where user user is ready to hire",
  },
  PAUSED: {
    defaultMessage: "Paused",
    id: "KA/hfo",
    description:
      "Status for an application to an advertisement that is unavailable",
  },
  WITHDREW: {
    defaultMessage: "Withdrew",
    id: "C+hP/v",
    description: "Status for an application that has been withdrawn",
  },
  REMOVED: commonMessages.removed,
  SCREENED_OUT: commonMessages.screenedOut,
});

// Map pool candidate statuses to their regular combined statuses
export const statusMap = new Map<PoolCandidateStatus, MessageDescriptor>([
  [PoolCandidateStatus.Draft, combinedStatusLabels.DRAFT],
  [PoolCandidateStatus.NewApplication, combinedStatusLabels.RECEIVED],
  [PoolCandidateStatus.ApplicationReview, combinedStatusLabels.UNDER_REVIEW],
  [PoolCandidateStatus.ScreenedIn, combinedStatusLabels.PENDING_SKILLS],
  [PoolCandidateStatus.UnderAssessment, combinedStatusLabels.ASSESSMENT],
  [PoolCandidateStatus.DraftExpired, combinedStatusLabels.DATE_PASSED],
  [
    PoolCandidateStatus.ScreenedOutApplication,
    combinedStatusLabels.SCREENED_OUT,
  ],
  [
    PoolCandidateStatus.ScreenedOutAssessment,
    combinedStatusLabels.SCREENED_OUT,
  ],
  [PoolCandidateStatus.ScreenedOutNotInterested, combinedStatusLabels.REMOVED],
  [PoolCandidateStatus.ScreenedOutNotResponsive, combinedStatusLabels.REMOVED],
  [PoolCandidateStatus.QualifiedAvailable, combinedStatusLabels.READY_TO_HIRE],
  [PoolCandidateStatus.QualifiedUnavailable, combinedStatusLabels.PAUSED],
  [PoolCandidateStatus.QualifiedWithdrew, combinedStatusLabels.WITHDREW],
  [PoolCandidateStatus.PlacedTentative, combinedStatusLabels.READY_TO_HIRE],
  [PoolCandidateStatus.PlacedCasual, combinedStatusLabels.HIRED_CASUAL],
  [PoolCandidateStatus.PlacedTerm, combinedStatusLabels.HIRED_TERM],
  [
    PoolCandidateStatus.PlacedIndeterminate,
    combinedStatusLabels.HIRED_INDETERMINATE,
  ],
  [PoolCandidateStatus.Expired, combinedStatusLabels.EXPIRED],
  [PoolCandidateStatus.Removed, combinedStatusLabels.REMOVED],
]);

// Map pool candidate statuses to their suspended combined statuses
const suspendedStatusMap = new Map<PoolCandidateStatus, MessageDescriptor>([
  [PoolCandidateStatus.QualifiedAvailable, combinedStatusLabels.NOT_INTERESTED],
]);

/**
 * Derived a combined status from the pool candidate status and the suspendedAt timestamp
 *
 * @param status  pool candidate status
 * @param suspendedAt  The timestamp for the user to suspend the pool candidate.  If suspended the label may be different.
 * @returns MessageDescriptor | null    Returns the derived status label
 */
export const derivedStatusLabel = (
  status: Maybe<PoolCandidateStatus> | undefined,
  suspendedAt: PoolCandidate["suspendedAt"],
): MessageDescriptor | null => {
  if (!status) return null;
  const isSuspended = suspendedAt && new Date() > parseDateTimeUtc(suspendedAt);

  const combinedStatus =
    isSuspended && suspendedStatusMap.has(status)
      ? suspendedStatusMap.get(status) // special suspended label
      : statusMap.get(status); // regular label

  return combinedStatus ?? null;
};

export const getCombinedStatusLabel = (
  statusLabelKey: keyof typeof combinedStatusLabels,
): MessageDescriptor =>
  getOrThrowError(
    combinedStatusLabels,
    statusLabelKey,
    `Invalid statusLabelKey '${statusLabelKey}'`,
  );

export const getPriorityWeight = (priorityWeight: number): PriorityWeight => {
  if (priorityWeight === 10) {
    return PriorityWeight.PriorityEntitlement;
  }

  if (priorityWeight === 20) {
    return PriorityWeight.Veteran;
  }

  if (priorityWeight === 30) {
    return PriorityWeight.CitizenOrPermanentResident;
  }

  return PriorityWeight.Other;
};
