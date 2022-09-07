import React from "react";
import { useIntl } from "react-intl";
import { commonMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { BriefcaseIcon } from "@heroicons/react/24/solid";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import EquityOptions from "./EquityOptions";
import type { EmploymentEquityUpdateHandler, EquityKeys } from "./types";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import { User, PoolCandidate } from "../../api/generated";
import applicantProfileRoutes from "../../applicantProfileRoutes";
import directIntakeRoutes from "../../directIntakeRoutes";

export interface EmploymentEquityFormProps {
  user: User;
  isMutating: boolean;
  application?: PoolCandidate;
  onUpdate: EmploymentEquityUpdateHandler;
}

export const EmploymentEquityForm: React.FC<EmploymentEquityFormProps> = ({
  user,
  application,
  onUpdate,
  isMutating,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const profilePaths = applicantProfileRoutes(locale);
  const directIntakePaths = directIntakeRoutes(locale);
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? directIntakePaths.poolApply(application.pool.id)
      : profilePaths.home(user.id);

  const handleUpdate = (key: EquityKeys, value: boolean) => {
    return onUpdate(user.id, {
      [key]: value,
    });
  };

  const applicationBreadcrumbs = application
    ? [
        {
          title: intl.formatMessage({
            defaultMessage: "My Applications",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          href: directIntakePaths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title:
            application.poolAdvertisement?.name?.[locale] ||
            intl.formatMessage({
              defaultMessage: "Pool name not found",
              description:
                "Pools name breadcrumb from applicant profile wrapper if no name set.",
            }),
          href: directIntakePaths.poolApply(application.pool.id),
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "The Employment Equity Act of Canada (1995) identifies four groups who have experienced systemic employment barriers, and a number of obligations for the Government of Canada in addressing these barriers.",
        description:
          "Description text for Profile Form wrapper in DiversityEquityInclusionForm",
      })}
      title={intl.formatMessage({
        defaultMessage: "Diversity, equity and inclusion",
        description:
          "Title for Profile Form wrapper  in DiversityEquityInclusionForm",
      })}
      crumbs={[
        ...applicationBreadcrumbs,
        {
          title: intl.formatMessage({
            defaultMessage: "Diversity, equity and inclusion",
            description:
              "Display Text for Diversity, equity and inclusion Page",
          }),
        },
      ]}
      cancelLink={{
        href: returnRoute,
        children: intl.formatMessage(
          application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
            ? commonMessages.backToApplication
            : commonMessages.backToProfile,
        ),
      }}
      prefixBreadcrumbs={!application}
    >
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "While the language around these categories is in need of updating, the Government of Canada will sometimes use these categories in hiring to make sure that it is meeting the aims of employment equity.",
          description:
            "Description of how the Government of Canada uses employment equity categories in hiring.",
        })}
      </p>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            'These four groups are "women, Aboriginal peoples, persons with disabilities, and members of visible minorities."',
          description: "List of the employment equity categories",
        })}
      </p>
      <div
        data-h2-background-color="base(light.dt-gray)"
        data-h2-margin="base(x2, 0, 0, 0)"
        data-h2-radius="base(s)"
        data-h2-padding="base(x1)"
      >
        <p data-h2-margin="base(0, 0, x.5, 0)">
          {intl.formatMessage({
            defaultMessage:
              "<strong>This section is optional</strong>. If you are a member of one or more of these employment equity groups, and you do not wish to self identify on this platform, there is no obligation to do so. <strong>Complete the form below if you meet both of these conditions</strong>:",
            description:
              "Explanation that employment equity information is optional.",
          })}
        </p>
        <ul>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "You are a member of one or more of these employment equity groups.",
              description:
                "Instruction on when to fill out equity information, item one",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "You would like to be considered for opportunities addressed to  underrepresented groups.",
              description:
                "Instruction on when to fill out equity information, item two",
            })}
          </li>
        </ul>
      </div>
      <h2 data-h2-font-size="base(h5, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "How will this data be used?",
          description:
            "Heading for how employment equity information will be used.",
        })}
      </h2>
      <ul>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "This information will be shared with hiring managers.",
            description:
              "Explanation on how employment equity information will be used, item one",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "This information will be used to match you to prioritized jobs.",
            description:
              "Explanation on how employment equity information will be used, item two",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "This information will be used in an anonymous form for statistical purposes.",
            description:
              "Explanation on how employment equity information will be used, item three",
          })}
        </li>
      </ul>
      <EquityOptions
        isDisabled={isMutating}
        isIndigenous={user.isIndigenous}
        isVisibleMinority={user.isVisibleMinority}
        isWoman={user.isWoman}
        hasDisability={user.hasDisability}
        onAdd={(key: EquityKeys) => handleUpdate(key, true)}
        onRemove={(key: EquityKeys) => handleUpdate(key, false)}
      />
      <ProfileFormFooter
        mode="cancelButton"
        cancelLink={{
          href: returnRoute,
          children: intl.formatMessage(
            application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
              ? commonMessages.backToApplication
              : commonMessages.backToProfile,
          ),
        }}
      />
    </ProfileFormWrapper>
  );
};

export default EmploymentEquityForm;
