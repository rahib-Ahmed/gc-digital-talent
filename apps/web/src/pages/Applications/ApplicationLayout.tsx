import React from "react";
import { useIntl, defineMessage } from "react-intl";
import { Outlet, useParams } from "react-router-dom";

import {
  TableOfContents,
  Stepper,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import {
  getFullPoolAdvertisementTitleHtml,
  getFullPoolAdvertisementTitleLabel,
} from "~/utils/poolUtils";
import { useGetApplicationQuery } from "~/api/generated";
import {
  checkForDisabledPage,
  deriveSteps,
  getApplicationPages,
} from "~/utils/applicationUtils";

import { ApplicationPageProps } from "./ApplicationApi";
import { StepDisabledPage } from "./StepDisabledPage/StepDisabledPage";

const ApplicationPageWrapper = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { experienceId } = useParams();
  const pages = getApplicationPages({
    intl,
    paths,
    application,
    experienceId,
  });

  const poolNameHtml = getFullPoolAdvertisementTitleHtml(
    intl,
    application.poolAdvertisement,
  );
  const poolName = getFullPoolAdvertisementTitleLabel(
    intl,
    application.poolAdvertisement,
  );
  const pageTitle = defineMessage({
    defaultMessage: "Apply to {poolName}",
    id: "K8CPir",
    description: "Heading for the application page",
  });

  const currentPage = useCurrentPage(pages);
  const currentCrumbs = currentPage?.crumbs || [];
  const steps = deriveSteps(
    pages,
    application.submittedSteps,
    application.user,
    application.poolAdvertisement,
  );
  const currentStep = steps?.findIndex((step) =>
    currentPage?.link.url.includes(step.href),
  );

  const crumbs = useBreadcrumbs([
    {
      url: paths.browsePools(),
      label: intl.formatMessage({
        defaultMessage: "Browse IT Jobs",
        id: "l1fsXC",
        description: "Breadcrumb link text for the browse pools page",
      }),
    },
    {
      url: application.poolAdvertisement?.id
        ? paths.pool(application.poolAdvertisement.id)
        : "#",
      label: getFullPoolAdvertisementTitleHtml(
        intl,
        application.poolAdvertisement,
      ),
    },
    ...currentCrumbs,
  ]);

  const { isOnDisabledPage, urlToReturnTo } = checkForDisabledPage(
    currentPage?.link.url,
    pages,
    application.submittedSteps,
  );

  return (
    <>
      <SEO title={intl.formatMessage(pageTitle, { poolName })} />
      <Hero
        title={intl.formatMessage(pageTitle, { poolName: poolNameHtml })}
        crumbs={crumbs}
        subtitle={currentPage?.subtitle}
      />
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-margin-top="base(x2)"
      >
        <TableOfContents.Wrapper>
          <TableOfContents.Sidebar>
            <Stepper
              label={intl.formatMessage({
                defaultMessage: "Application steps",
                id: "y2Rl/m",
                description: "Label for the application stepper navigation",
              })}
              currentIndex={currentStep}
              steps={steps}
            />
          </TableOfContents.Sidebar>
          <TableOfContents.Content>
            {isOnDisabledPage ? (
              <StepDisabledPage returnUrl={urlToReturnTo} />
            ) : (
              <Outlet />
            )}
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const ApplicationLayout = () => {
  const { applicationId } = useParams();
  const [{ data, fetching, error }] = useGetApplicationQuery({
    requestPolicy: "cache-first",
    variables: {
      id: applicationId || "",
    },
  });

  const application = data?.poolCandidate;

  return (
    <Pending fetching={fetching} error={error}>
      {application?.poolAdvertisement ? (
        <ApplicationPageWrapper application={application} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationLayout;
