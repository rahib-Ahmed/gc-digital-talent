import React from "react";
import { useIntl } from "react-intl";
import RocketLaunchIcon from "@heroicons/react/20/solid/RocketLaunchIcon";

import { Alert, Link } from "@gc-digital-talent/ui";
import { useLocale } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

export const getPageInfo: GetPageNavInfo = ({ application, paths, intl }) => {
  const path = paths.applicationSuccess(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "We successfully received your application",
      id: "79m9jN",
      description: "Page title for the application success page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Get a head start on next steps or check out other opportunities.",
      id: "zJdfyv",
      description: "Subtitle for the application success page",
    }),
    icon: RocketLaunchIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Success",
          id: "bQtRF+",
          description: "Breadcrumb link text for the application success page",
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

const ApplicationSuccess = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const paths = useRoutes();
  const { currentStepOrdinal, isIAP } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });

  return (
    <Alert.Root type="success" live={false}>
      <Alert.Title>{pageInfo.title}</Alert.Title>
      <p data-h2-margin="base(x.5, 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "Your confirmation number is: <strong>{id}</strong>",
            id: "/uOExm",
            description: "An application confirmation number",
          },
          {
            id: application.id,
          },
        )}
      </p>
      <p data-h2-margin="base(x.5, 0)">
        {isIAP
          ? intl.formatMessage({
              defaultMessage:
                "Thank you for your interest in becoming an IT apprentice with the Government of Canada. Your lived experience, skills, passion and interests are warmly received and acknowledged. A member of the Office of Indigenous Initiatives team will contact you within the next three to five business days to discuss your application.",
              id: "cTCdw5",
              description:
                "Description of review process and next steps for the IAP applicant.",
            })
          : intl.formatMessage({
              defaultMessage:
                "We'll be in touch if your application matches the criteria outlined by the opportunity. In the meantime, check out the following resources for further information on what might be next.",
              id: "lE92J0",
              description:
                "Description of review process and next steps for the applicant.",
            })}
      </p>
      <ul data-h2-margin-bottom="base(x1.5)">
        {!isIAP && (
          <li data-h2-margin-bottom="base(x.25)">
            <Link
              newTab
              external
              href={
                locale === "en"
                  ? "https://www.tbs-sct.canada.ca/tbsf-fsct/330-60-eng.asp"
                  : "https://www.tbs-sct.canada.ca/tbsf-fsct/330-60-fra.asp"
              }
              data-h2-display="base(inline-block)"
              data-h2-text-align="base(left)"
              data-h2-vertical-align="base(top)"
            >
              {intl.formatMessage({
                defaultMessage: "Find and complete security clearance forms.",
                id: "otUMji",
                description:
                  "Link text for government of canada security clearance forms",
              })}
            </Link>
          </li>
        )}
        <li data-h2-margin-bottom="base(x.25)">
          <Link
            href={paths.myProfile()}
            data-h2-display="base(inline-block)"
            data-h2-text-align="base(left)"
            data-h2-vertical-align="base(top)"
          >
            {intl.formatMessage({
              defaultMessage:
                "Update profile and contact information to ensure you receive notifications.",
              id: "nFO3Ai",
              description:
                "Link text to users profile to update contact information",
            })}
          </Link>
        </li>
        {!isIAP && (
          <li data-h2-margin-bottom="base(x.25)">
            <Link
              href={`${paths.browsePools()}#ongoingRecruitments`}
              data-h2-display="base(inline-block)"
              data-h2-text-align="base(left)"
              data-h2-vertical-align="base(top)"
            >
              {intl.formatMessage({
                defaultMessage:
                  "Submit an application to ongoing recruitment talent pools.",
                id: "ZTnze/",
                description:
                  "Link text to the ongoing recruitments section on the browse page",
              })}
            </Link>
          </li>
        )}
      </ul>
      <p data-h2-margin="base(x.5, 0)">
        <Link
          href={paths.profileAndApplications({ fromIapSuccess: isIAP })}
          mode="solid"
          color="primary"
        >
          {intl.formatMessage({
            defaultMessage: "Visit your Profile and applications page",
            id: "26Qj2A",
            description:
              "Link text to navigate to the profile and applications page",
          })}
        </Link>
      </p>
      <p data-h2-font-size="base(caption)">
        {intl.formatMessage({
          defaultMessage:
            "* Note that your confirmation number can also be found in the Track your applications section on your Profile and applications page.",
          id: "lxDgNf",
          description:
            "Note that the application confirmation number is available on the profile and applications page",
        })}
      </p>
    </Alert.Root>
  );
};

const ApplicationSuccessPage = () => (
  <ApplicationApi PageComponent={ApplicationSuccess} />
);

export default ApplicationSuccessPage;
