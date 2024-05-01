import * as React from "react";
import { defineMessage, useIntl } from "react-intl";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import { useQuery } from "urql";

import {
  commonMessages,
  errorMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Heading,
  Link,
  NotFound,
  Pending,
  Chip,
  Separator,
  TableOfContents,
} from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import SEO from "~/components/SEO/SEO";
import { routeErrorMessages } from "~/hooks/useErrorMessages";
import { getAssessmentPlanStatus } from "~/validators/pool/assessmentPlan";
import { getPoolCompletenessBadge } from "~/utils/poolUtils";
import messages from "~/messages/adminMessages";

import OrganizeSection, {
  sectionTitle as organizeSectionTitle,
} from "./components/OrganizeSection";
import SkillSummarySection, {
  sectionTitle as skillSummarySectionTitle,
} from "./components/SkillSummarySection";
import { PAGE_SECTION_ID } from "./navigation";

const pageTitle = defineMessage(messages.assessmentPlan);

const pageSubtitle = defineMessage({
  defaultMessage:
    "Select, organize and define the assessments used to evaluate each skill in the advertisement. Make sure every essential skill is assessed at least once to complete your assessment plan.",
  id: "iuA2pt",
  description: "Subtitle for the assessment plan builder",
});

export const AssessmentPlanBuilderPool_Fragment = graphql(/* GraphQL */ `
  fragment AssessmentPlanBuilderPool on Pool {
    id
    ...OrganizeSectionPool
    ...SkillSummarySectionPool
    publishedAt
    poolSkills {
      id
      skill {
        id
        category
        key
        name {
          en
          fr
        }
      }
    }
    assessmentSteps {
      id
      type
      poolSkills {
        id
      }
    }
  }
`);

export interface AssessmentPlanBuilderProps {
  poolQuery: FragmentType<typeof AssessmentPlanBuilderPool_Fragment>;
  pageIsLoading: boolean;
}

export const AssessmentPlanBuilder = ({
  poolQuery,
  pageIsLoading,
}: AssessmentPlanBuilderProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const pool = getFragment(AssessmentPlanBuilderPool_Fragment, poolQuery);
  pool.poolSkills?.sort((a, b) => {
    const aName = getLocalizedName(a?.skill?.name, intl);
    const bName = getLocalizedName(b?.skill?.name, intl);
    return aName.localeCompare(bName);
  });

  const assessmentStatus = getAssessmentPlanStatus(pool);
  const assessmentBadge = getPoolCompletenessBadge(assessmentStatus);

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <Heading level="h2" Icon={ClipboardDocumentListIcon} color="primary">
        {intl.formatMessage(pageTitle)}
        <div data-h2-flex-grow="base(2)" />
        <Chip color={assessmentBadge.color} data-h2-flex-shrink="base(0)">
          {intl.formatMessage(assessmentBadge.label)}
        </Chip>
      </Heading>
      <p data-h2-margin="base(x1 0)">{intl.formatMessage(pageSubtitle)}</p>
      <Separator />
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink
                id={PAGE_SECTION_ID.ORGANIZE_ASSESSMENT_APPROACH}
              >
                {intl.formatMessage(organizeSectionTitle)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={PAGE_SECTION_ID.SKILL_SUMMARY}>
                {intl.formatMessage(skillSummarySectionTitle)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
          <Link mode="solid" color="secondary" href={routes.poolView(pool.id)}>
            {intl.formatMessage({
              defaultMessage: "Back to process details",
              id: "nPPUMW",
              description: "Link text to go back to the process details page",
            })}
          </Link>
        </TableOfContents.Navigation>

        <TableOfContents.Content>
          <OrganizeSection poolQuery={pool} pageIsLoading={pageIsLoading} />
          <SkillSummarySection poolQuery={pool} />
          <Separator space="lg" />
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </>
  );
};

type RouteParams = {
  poolId: Scalars["ID"]["output"];
};

const AssessmentPlanBuilderPage_Query = graphql(/* GraphQL */ `
  query AssessmentPlanBuilderPage($poolId: UUID!) {
    # the existing data of the pool to edit
    pool(id: $poolId) {
      ...AssessmentPlanBuilderPool
      team {
        id
        name
      }
    }
  }
`);

export const AssessmentPlanBuilderPage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const authorization = useAuthorization();

  const notFoundMessage = intl.formatMessage(
    {
      defaultMessage: "Pool {poolId} not found.",
      id: "Sb2fEr",
      description: "Message displayed for pool not found.",
    },
    { poolId },
  );

  if (!poolId) {
    throw new Response(notFoundMessage, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const [{ data: queryData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: AssessmentPlanBuilderPage_Query,
      variables: { poolId },
    });

  // RequireAuth in router can't check team roles
  const authorizedToSeeThePage: boolean =
    authorization.roleAssignments?.some(
      (authorizedRoleAssignment) =>
        (authorizedRoleAssignment.role?.name === ROLE_NAME.PoolOperator &&
          authorizedRoleAssignment.team?.name ===
            queryData?.pool?.team?.name) ||
        authorizedRoleAssignment.role?.name === ROLE_NAME.CommunityManager ||
        authorizedRoleAssignment.role?.name === ROLE_NAME.PlatformAdmin,
    ) ?? false;

  // figure out what content should be displayed
  const content = (): React.ReactNode => {
    if (queryData?.pool && authorizedToSeeThePage) {
      return (
        <AssessmentPlanBuilder
          poolQuery={queryData.pool}
          pageIsLoading={queryFetching}
        />
      );
    }
    if (!queryData?.pool) {
      return (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Pool {poolId} not found.",
                id: "Sb2fEr",
                description: "Message displayed for pool not found.",
              },
              { poolId },
            )}
          </p>
        </NotFound>
      );
    }
    if (!authorizedToSeeThePage) {
      // reuse error from routing errors
      return intl.formatMessage(routeErrorMessages.unauthorizedTitle);
    }

    // shouldn't drop through to this
    return intl.formatMessage(errorMessages.unknown);
  };

  return (
    <AdminContentWrapper>
      <Pending
        fetching={queryFetching || !authorization.isLoaded}
        error={queryError}
      >
        {content()}
      </Pending>
    </AdminContentWrapper>
  );
};

export default AssessmentPlanBuilderPage;
