import React from "react";
import { useIntl } from "react-intl";
import SparklesIcon from "@heroicons/react/20/solid/SparklesIcon";

import { Heading, Link, Separator } from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationSkillsIntro(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Let's talk about skills",
      id: "7ET77N",
      description: "Page title for the application skills introduction page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Tell us about how you meet the skill requirements for this opportunity.",
      id: "+vHVZ2",
      description: "Subtitle for the application skills page",
    }),
    icon: SparklesIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(applicationMessages.numberedStepIntro, {
          stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

const ApplicationSkillsIntroduction = ({
  application,
}: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { currentStepOrdinal, isIAP } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const { applicantDashboard } = useFeatureFlags();

  return (
    <>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "The next step is the most important piece of your application where you'll be asked to talk about how you meet the skill requirements for this role.",
          id: "ikYbDD",
          description:
            "Application step for skill requirements, introduction, description, paragraph one",
        })}
      </p>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "In the same way that you selected items from your résumé to confirm the experience and education requirements, we'll ask you to describe one or more experiences from your résumé where you actively used the required skill.",
          id: "pKLIzg",
          description:
            "Application step for skill requirements, introduction, description, paragraph two",
        })}
      </p>
      <Separator
        orientation="horizontal"
        decorative
        data-h2-background="base(black.light)"
        data-h2-margin="base(x2, 0)"
      />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.25, x.5)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
      >
        <Link
          href={paths.applicationSkills(application.id)}
          mode="solid"
          type="button"
          color="primary"
        >
          {intl.formatMessage({
            defaultMessage: "Let's get to it!",
            id: "PnyBYM",
            description: "Action button to move to the next step",
          })}
        </Link>
        <Link
          href={
            applicantDashboard
              ? paths.dashboard({ fromIapDraft: isIAP })
              : paths.myProfile()
          }
          mode="inline"
          type="button"
          color="secondary"
        >
          {intl.formatMessage(applicationMessages.saveQuit)}
        </Link>
      </div>
    </>
  );
};

const ApplicationSkillsIntroductionPage = () => (
  <ApplicationApi PageComponent={ApplicationSkillsIntroduction} />
);

export default ApplicationSkillsIntroductionPage;
