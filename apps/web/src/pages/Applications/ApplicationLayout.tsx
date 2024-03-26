import React from "react";
import { useIntl, defineMessage } from "react-intl";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import flatMap from "lodash/flatMap";
import { OperationContext, useQuery } from "urql";

import { TableOfContents, Stepper, Loading } from "@gc-digital-talent/ui";
import { empty, isUuidError, notEmpty } from "@gc-digital-talent/helpers";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import IapContactDialog from "~/components/Dialog/IapContactDialog";
import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import { poolTitle, isIAPPool } from "~/utils/poolUtils";
import {
  applicationStepsToStepperArgs,
  getApplicationSteps,
  getNextStepToSubmit,
  isOnDisabledPage,
} from "~/utils/applicationUtils";

import StepDisabledPage from "./StepDisabledPage/StepDisabledPage";
import ApplicationContextProvider from "./ApplicationContext";
import useApplicationId from "./useApplicationId";
import { ContextType } from "./useApplication";
import Application_PoolCandidateFragment from "./fragment";

type RouteParams = {
  experienceId: string;
};

interface ApplicationPageWrapperProps {
  query: FragmentType<typeof Application_PoolCandidateFragment>;
}

const ApplicationPageWrapper = ({ query }: ApplicationPageWrapperProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { experienceId } = useParams<RouteParams>();
  const application = getFragment(Application_PoolCandidateFragment, query);
  const steps = getApplicationSteps({
    intl,
    paths,
    application,
    experienceId,
  });
  const title = poolTitle(intl, application.pool);
  const isIAP = isIAPPool(application.pool);

  const pageTitle = defineMessage({
    defaultMessage: "Apply to {poolName}",
    id: "K8CPir",
    description: "Heading for the application page",
  });

  const pages = flatMap(steps, (step) => [
    step.mainPage,
    step.introductionPage,
    ...(step.auxiliaryPages ?? []),
  ]).filter(notEmpty);

  const currentPage = useCurrentPage(pages);
  const currentCrumbs = currentPage?.crumbs || [];

  const currentStepIndex = steps.findIndex(
    (step) =>
      step.mainPage.link.url === currentPage?.link.url ||
      step.introductionPage?.link.url === currentPage?.link.url ||
      step.auxiliaryPages?.some(
        (auxPage) => auxPage.link.url === currentPage?.link?.url,
      ),
  );
  const nextStepToSubmit = getNextStepToSubmit(
    steps,
    application.submittedSteps,
  );
  const followingStep =
    currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        url: paths.browsePools(),
        label: intl.formatMessage(navigationMessages.browseJobs),
      },
      {
        url: paths.pool(application.pool.id),
        label: title.html,
      },
      ...currentCrumbs,
    ],
  });

  const userIsOnDisabledPage = isOnDisabledPage(
    currentPage?.link.url,
    steps,
    application.submittedSteps,
  );

  // If we cannot find the current page, redirect to the first step
  // that has not been submitted yet, or the last step
  React.useEffect(() => {
    if (empty(currentPage)) {
      navigate(nextStepToSubmit.mainPage.link.url, {
        replace: true,
      });
    }
  }, [currentPage, navigate, nextStepToSubmit]);

  return (
    <ApplicationContextProvider
      application={application}
      followingPageUrl={
        followingStep?.introductionPage?.link.url ??
        followingStep?.mainPage.link.url
      }
      currentStepOrdinal={currentStepIndex + 1}
    >
      <SEO
        title={intl.formatMessage(pageTitle, { poolName: title.label })}
        description={currentPage?.subtitle}
      />
      <Hero
        title={intl.formatMessage(pageTitle, { poolName: title.html })}
        crumbs={crumbs}
        subtitle={currentPage?.subtitle}
      />
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-margin-top="base(x3)"
      >
        <TableOfContents.Wrapper>
          <TableOfContents.Sidebar>
            <Stepper
              label={intl.formatMessage({
                defaultMessage: "Application steps",
                id: "y2Rl/m",
                description: "Label for the application stepper navigation",
              })}
              currentIndex={currentStepIndex}
              steps={applicationStepsToStepperArgs(steps, application)}
            />
            {isIAP && (
              <div data-h2-margin="base(x1 0)">
                <IapContactDialog />
              </div>
            )}
          </TableOfContents.Sidebar>
          <TableOfContents.Content>
            {userIsOnDisabledPage ? (
              <StepDisabledPage
                returnUrl={nextStepToSubmit.mainPage.link.url}
              />
            ) : (
              <Outlet context={{ application } satisfies ContextType} />
            )}
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </ApplicationContextProvider>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: [
    "AwardExperience",
    "CommunityExperience",
    "EducationExperience",
    "PersonalExperience",
    "WorkExperience",
  ], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first",
};

const Application_Query = graphql(/* GraphQL */ `
  query Application($id: UUID!) {
    poolCandidate(id: $id) {
      ...Application_PoolCandidate
    }
  }
`);

const ApplicationLayout = () => {
  const id = useApplicationId();
  const intl = useIntl();
  const [{ data, fetching, error, stale }] = useQuery({
    query: Application_Query,
    context,
    variables: {
      id,
    },
  });

  if (error) {
    if (isUuidError(error)) {
      throw new Response("", {
        status: 404,
        statusText: intl.formatMessage(commonMessages.notFound),
      });
    }
  }

  return (
    <>
      {fetching || stale ? (
        <Loading live="polite" data-h2-background-color="base(white.99)" />
      ) : null}
      {data?.poolCandidate ? (
        <ApplicationPageWrapper query={data.poolCandidate} />
      ) : null}
    </>
  );
};

export default ApplicationLayout;
