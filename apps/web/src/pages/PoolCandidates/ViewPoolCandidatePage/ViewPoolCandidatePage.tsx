import { defineMessage, useIntl } from "react-intl";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import { OperationContext, useQuery } from "urql";

import {
  NotFound,
  Pending,
  Accordion,
  Heading,
  Sidebar,
  Chip,
  Chips,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  User,
  Scalars,
  Maybe,
  graphql,
  ArmedForcesStatus,
  PoolCandidateSnapshotQuery,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";
import AdminHero from "~/components/Hero/AdminHero";
import { getCandidateStatusChip } from "~/utils/poolCandidate";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import { getFullNameLabel } from "~/utils/nameUtils";
import AssessmentResultsTable from "~/components/AssessmentResultsTable/AssessmentResultsTable";
import ChangeStatusDialog from "~/components/CandidateDialog/ChangeStatusDialog";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import ErrorBoundary from "~/components/ErrorBoundary/ErrorBoundary";
import pageTitles from "~/messages/pageTitles";
import { JobPlacementOptionsFragmentType } from "~/components/PoolCandidatesTable/JobPlacementDialog";

import CareerTimelineSection from "./components/CareerTimelineSection/CareerTimelineSection";
import ApplicationInformation from "./components/ApplicationInformation/ApplicationInformation";
import ProfileDetails from "./components/ProfileDetails/ProfileDetails";
import MoreActions from "./components/MoreActions/MoreActions";
import ClaimVerification from "./components/ClaimVerification/ClaimVerification";

const screeningAndAssessmentTitle = defineMessage({
  defaultMessage: "Screening and assessment",
  id: "R8Naqm",
  description: "Heading for the information of an application",
});

const PoolCandidate_SnapshotQuery = graphql(/* GraphQL */ `
  query PoolCandidateSnapshot($poolCandidateId: UUID!) {
    ...JobPlacementOptions
    poolCandidate(id: $poolCandidateId) {
      ...MoreActions
      ...ClaimVerification
      ...AssessmentResultsTable
      id
      status {
        value
        label {
          en
          fr
        }
      }
      finalDecision {
        value
        label {
          en
          fr
        }
      }
      user {
        ...ApplicationProfileDetails
        ...ProfileDocument
        ...PoolStatusTable
        ...ChangeStatusDialog_User
        id
        firstName
        lastName
        currentCity
        currentProvince {
          value
          label {
            en
            fr
          }
        }
        telephone
        email
        citizenship {
          value
          label {
            en
            fr
          }
        }
        preferredLang {
          value
          label {
            en
            fr
          }
        }
        preferredLanguageForInterview {
          value
          label {
            en
            fr
          }
        }
        preferredLanguageForExam {
          value
          label {
            en
            fr
          }
        }
        hasPriorityEntitlement
        armedForcesStatus {
          value
          label {
            en
            fr
          }
        }
        priorityWeight
        poolCandidates {
          id
          status {
            value
            label {
              en
              fr
            }
          }
          expiryDate
          notes
          suspendedAt
          user {
            id
          }
          pool {
            id
            processNumber
            name {
              en
              fr
            }
            classification {
              id
              group
              level
            }
            stream {
              value
              label {
                en
                fr
              }
            }
            publishingGroup {
              value
              label {
                en
                fr
              }
            }
            team {
              id
              name
              displayName {
                en
                fr
              }
            }
          }
        }
        experiences {
          id
          __typename
          details
          user {
            id
            email
          }
          skills {
            id
            key
            name {
              en
              fr
            }
            description {
              en
              fr
            }
            category {
              value
              label {
                en
                fr
              }
            }
            experienceSkillRecord {
              details
            }
          }
          ... on AwardExperience {
            title
            issuedBy
            awardedDate
            awardedTo {
              value
              label {
                en
                fr
              }
            }
            awardedScope {
              value
              label {
                en
                fr
              }
            }
            details
          }
          ... on CommunityExperience {
            title
            organization
            project
            startDate
            endDate
            details
          }
          ... on EducationExperience {
            institution
            areaOfStudy
            thesisTitle
            startDate
            endDate
            type {
              value
              label {
                en
                fr
              }
            }
            status {
              value
              label {
                en
                fr
              }
            }
            details
          }
          ... on PersonalExperience {
            title
            description
            startDate
            endDate
            details
          }
          ... on WorkExperience {
            role
            organization
            division
            startDate
            endDate
            details
          }
        }
      }
      educationRequirementExperiences {
        id
        __typename
        details
        user {
          id
          email
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo {
            value
            label {
              en
              fr
            }
          }
          awardedScope {
            value
            label {
              en
              fr
            }
          }
          details
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
          details
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type {
            value
            label {
              en
              fr
            }
          }
          status {
            value
            label {
              en
              fr
            }
          }
          details
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
          details
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
          details
        }
      }
      educationRequirementOption {
        value
        label {
          en
          fr
        }
      }
      profileSnapshot
      notes
      signature
      submittedAt
      expiryDate
      pool {
        id
        name {
          en
          fr
        }
        stream {
          value
          label {
            en
            fr
          }
        }
        publishingGroup {
          value
          label {
            en
            fr
          }
        }
        classification {
          id
          group
          level
        }
        poolSkills {
          skill {
            id
            key
            name {
              en
              fr
            }
            description {
              en
              fr
            }
            category {
              value
              label {
                en
                fr
              }
            }
            families {
              id
              key
              name {
                en
                fr
              }
            }
          }
        }
        generalQuestions {
          id
          question {
            en
            fr
          }
        }
        assessmentSteps {
          id
          title {
            en
            fr
          }
          type {
            value
            label {
              en
              fr
            }
          }
          sortOrder
          poolSkills {
            id
            type {
              value
              label {
                en
                fr
              }
            }
          }
        }
        poolSkills {
          id
          type {
            value
            label {
              en
              fr
            }
          }
          requiredLevel
          skill {
            name {
              en
              fr
            }
            description {
              en
              fr
            }
            id
            category {
              value
              label {
                en
                fr
              }
            }
            key
          }
        }
        screeningQuestions {
          id
          question {
            en
            fr
          }
        }
        ...ApplicationInformation_PoolFragment
      }
      assessmentResults {
        id
        poolCandidate {
          id
          pool {
            id
          }
          user {
            id
          }
        }
        assessmentDecision {
          value
          label {
            en
            fr
          }
        }
        assessmentDecisionLevel {
          value
          label {
            en
            fr
          }
        }
        assessmentResultType
        assessmentStep {
          id
          type {
            value
            label {
              en
              fr
            }
          }
          title {
            en
            fr
          }
        }
        justifications {
          value
          label {
            en
            fr
          }
        }
        assessmentDecisionLevel {
          value
          label {
            en
            fr
          }
        }
        skillDecisionNotes
        poolSkill {
          id
          type {
            value
            label {
              en
              fr
            }
          }
          requiredLevel
          skill {
            id
            key
            category {
              value
              label {
                en
                fr
              }
            }
            name {
              en
              fr
            }
            description {
              en
              fr
            }
          }
        }
      }
      screeningQuestionResponses {
        id
        answer
        screeningQuestion {
          id
        }
      }
      assessmentStatus {
        currentStep
        overallAssessmentStatus
        assessmentStepStatuses {
          step
          decision
        }
      }
    }
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`);

export interface ViewPoolCandidateProps {
  poolCandidate: NonNullable<PoolCandidateSnapshotQuery["poolCandidate"]>;
  jobPlacementOptions: JobPlacementOptionsFragmentType;
}

export const ViewPoolCandidate = ({
  poolCandidate,
  jobPlacementOptions,
}: ViewPoolCandidateProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const parsedSnapshot: Maybe<User> = JSON.parse(poolCandidate.profileSnapshot);
  const snapshotCandidate = parsedSnapshot?.poolCandidates
    ?.filter(notEmpty)
    .find(({ id }) => id === poolCandidate.id);
  const nonEmptyExperiences = unpackMaybes(parsedSnapshot?.experiences);
  const statusChip = getCandidateStatusChip(
    poolCandidate.finalDecision,
    poolCandidate.assessmentStatus,
    intl,
  );

  const candidateName = getFullNameLabel(
    poolCandidate.user.firstName,
    poolCandidate.user.lastName,
    intl,
  );

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.processes),
        url: paths.poolTable(),
      },
      {
        label: getFullPoolTitleLabel(intl, {
          stream: poolCandidate.pool.stream,
          name: poolCandidate.pool.name,
          publishingGroup: poolCandidate.pool.publishingGroup,
          classification: poolCandidate.pool.classification,
        }),
        url: paths.poolView(poolCandidate.pool.id),
      },
      {
        label: intl.formatMessage(screeningAndAssessmentTitle),
        url: paths.screeningAndEvaluation(poolCandidate.pool.id),
      },
      {
        label: candidateName,
        url: paths.poolCandidateApplication(poolCandidate.id),
      },
    ],
    isAdmin: true,
  });

  return (
    <>
      <AdminHero
        title={candidateName}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
        contentRight={
          <Chips>
            <Chip
              key="status"
              color={statusChip.color}
              data-h2-font-weight="base(700)"
            >
              {statusChip.label}
            </Chip>
            {poolCandidate.user.hasPriorityEntitlement ||
            poolCandidate.user.priorityWeight === 10 ? (
              <Chip key="priority" color="black">
                {intl.formatMessage({
                  defaultMessage: "Priority",
                  id: "xGMcBO",
                  description: "Label for priority chip on view candidate page",
                })}
              </Chip>
            ) : null}
            {poolCandidate.user.armedForcesStatus?.value ===
              ArmedForcesStatus.Veteran ||
            poolCandidate.user.priorityWeight === 20 ? (
              <Chip key="veteran" color="black">
                {intl.formatMessage({
                  defaultMessage: "Veteran",
                  id: "16iCWc",
                  description: "Label for veteran chip on view candidate page",
                })}
              </Chip>
            ) : null}
          </Chips>
        }
      >
        <ProfileDetails userQuery={poolCandidate.user} />
      </AdminHero>
      <AdminContentWrapper>
        <Sidebar.Wrapper>
          <Sidebar.Sidebar>
            <Heading size="h3">
              {intl.formatMessage({
                defaultMessage: "More actions",
                id: "QaMkP7",
                description:
                  "Title for more actions sidebar on view pool candidate page",
              })}
            </Heading>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Additional information, relevant to this candidate’s application.",
                id: "5cW3Ns",
                description:
                  "Description for more actions sidebar on view pool candidate page",
              })}
            </p>
            <MoreActions
              poolCandidate={poolCandidate}
              jobPlacementOptions={jobPlacementOptions}
            />
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-align-items="base(flex-start)"
              data-h2-gap="base(x.5)"
              data-h2-margin-bottom="base(x1)"
              data-h2-padding="base(x1)"
              data-h2-background-color="base(error.lightest.3)"
            >
              <Heading level="h3" size="h6" data-h2-margin-top="base(0)">
                {intl.formatMessage({
                  defaultMessage: "Candidate status",
                  id: "ETrCOq",
                  description:
                    "Title for admin editing a pool candidates status",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "These fields will only be available for migration purposes during a limited time.",
                  id: "FXpcgW",
                  description:
                    "Sentence to explain that status and expiry date fields are available for a specific purpose and for a limited amount of time",
                })}
              </p>
              <p>
                {intl.formatMessage(commonMessages.status)}
                {intl.formatMessage(commonMessages.dividingColon)}
                <ChangeStatusDialog
                  selectedCandidate={poolCandidate}
                  user={poolCandidate.user}
                />
              </p>
            </div>
          </Sidebar.Sidebar>
          <Sidebar.Content>
            <div data-h2-margin-bottom="base(x1)">
              <Heading
                Icon={ExclamationTriangleIcon}
                color="quaternary"
                data-h2-margin="base(x.75, 0, x1, 0)"
              >
                {intl.formatMessage(screeningAndAssessmentTitle)}
              </Heading>
              <AssessmentResultsTable poolCandidateQuery={poolCandidate} />
            </div>
            <ClaimVerification verificationQuery={poolCandidate} />
            {parsedSnapshot ? (
              <div data-h2-margin-top="base(x2)">
                <ErrorBoundary>
                  <ApplicationInformation
                    poolQuery={poolCandidate.pool}
                    user={poolCandidate.user}
                    snapshot={parsedSnapshot}
                    application={snapshotCandidate}
                  />
                </ErrorBoundary>
                <div data-h2-margin="base(x2 0)">
                  <Accordion.Root type="single" mode="card" collapsible>
                    <Accordion.Item value="otherRecruitments">
                      <Accordion.Trigger>
                        {intl.formatMessage({
                          defaultMessage: "Other processes",
                          id: "n+/HPL",
                          description:
                            "Heading for table of a users other applications and recruitments",
                        })}
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <PoolStatusTable userQuery={poolCandidate.user} />
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>
                </div>
                <ErrorBoundary>
                  <CareerTimelineSection
                    experiences={nonEmptyExperiences ?? []}
                  />
                </ErrorBoundary>
              </div>
            ) : (
              <NotFound
                headingMessage={intl.formatMessage(commonMessages.notFound)}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Profile snapshot not found.",
                    id: "JH2+tK",
                    description:
                      "Message displayed for profile snapshot not found.",
                  })}
                </p>
              </NotFound>
            )}
          </Sidebar.Content>
        </Sidebar.Wrapper>
      </AdminContentWrapper>
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["AssessmentResult"],
};

type RouteParams = {
  poolId: Scalars["ID"]["output"];
  poolCandidateId: Scalars["ID"]["output"];
};

export const ViewPoolCandidatePage = () => {
  const intl = useIntl();
  const { poolCandidateId } = useRequiredParams<RouteParams>("poolCandidateId");
  const [{ data, fetching, error }] = useQuery({
    query: PoolCandidate_SnapshotQuery,
    context,
    variables: { poolCandidateId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate ? (
        <ViewPoolCandidate
          poolCandidate={data.poolCandidate}
          jobPlacementOptions={data}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Candidate {poolCandidateId} not found.",
                id: "GrfidX",
                description: "Message displayed for pool candidate not found.",
              },
              { poolCandidateId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <ViewPoolCandidatePage />
  </RequireAuth>
);

Component.displayName = "AdminViewPoolCandidatePage";

export default ViewPoolCandidatePage;
