import React from "react";
import { useSearchParams } from "react-router-dom";
import { useIntl } from "react-intl";

import { Well, TableOfContents, Heading, Link } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import { flattenExperienceSkills } from "~/types/experience";
import MissingSkills from "~/components/MissingSkills";
import ExperienceSection from "~/components/UserProfile/ExperienceSection";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  Pool,
  Skill,
  WorkExperience,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import ProfileFormWrapper from "~/components/ProfileFormWrapper/ProfileFormWrapper";
import { wrapAbbr } from "~/utils/nameUtils";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import AddExperienceDialog from "./AddExperienceDialog";
import { PAGE_SECTION_ID, titles } from "../constants";

type MergedExperiences = Array<
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience
>;

export type ExperienceForDate =
  | (AwardExperience & { startDate: string; endDate: string })
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export interface ResumeAndRecruitmentsProps {
  applicantId: string;
  experiences?: MergedExperiences;
  pool?: Pool;
  missingSkills?: {
    requiredSkills: Skill[];
    optionalSkills: Skill[];
  };
}

export const ResumeAndRecruitments = ({
  experiences,
  missingSkills,
  applicantId,
  pool,
}: ResumeAndRecruitmentsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const applicationParam = applicationId
    ? `?applicationId=${applicationId}`
    : ``;

  const hasResumeItems = !!experiences?.length;
  const hasQualifiedRecruitments = false;

  const applicationBreadcrumbs: {
    label: string | React.ReactNode;
    url: string;
  }[] = pool
    ? [
        {
          label: intl.formatMessage({
            defaultMessage: "My applications",
            id: "jSYDwZ",
            description: "Link text for breadcrumb to user applications page.",
          }),
          url: paths.applications(applicantId),
        },
        {
          label: getFullPoolTitleHtml(intl, pool),
          url: paths.pool(pool.id),
        },
        {
          label: intl.formatMessage(navigationMessages.stepOne),
          url: paths.reviewApplication(applicationId ?? ""),
        },
        {
          label: intl.formatMessage(titles.resumeAndRecruitments),
          url: `${paths.resumeAndRecruitments(applicantId)}${applicationParam}`,
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      crumbs={
        applicationBreadcrumbs?.length
          ? applicationBreadcrumbs
          : [
              {
                label: intl.formatMessage(titles.resumeAndRecruitments),
                url: paths.resumeAndRecruitments(applicantId),
              },
            ]
      }
      prefixBreadcrumbs={!pool}
      description={intl.formatMessage(
        {
          defaultMessage:
            "Manage your experience and qualified recruitment processes.",
          id: "XY/crY",
          description:
            "Description for the Résumé and recruitments page in applicant profile.",
        },
        {
          abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
        },
      )}
      title={intl.formatMessage(titles.resumeAndRecruitments)}
      leaveRoomForNavigation
    >
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.AnchorLink id={PAGE_SECTION_ID.MANAGE_YOUR_RESUME}>
            {intl.formatMessage(titles.manageYourResume)}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink
            id={PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES}
          >
            {intl.formatMessage(titles.qualifiedRecruitmentProcesses)}
          </TableOfContents.AnchorLink>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <TableOfContents.Section id={PAGE_SECTION_ID.MANAGE_YOUR_RESUME}>
            <Heading Icon={BookmarkSquareIcon} color="red">
              {intl.formatMessage(titles.manageYourResume)}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This section is similar to your traditional résumé and describes your experiences across work, school, and life. You’ll be able to reuse this information on each application you submit on the platform, speeding up the process and ensuring that your information is always up-to-date.",
                id: "gPy2MA",
                description:
                  "Descriptive paragraph for the Manage your resume section of the résumé and recruitments page.",
              })}
            </p>
            {missingSkills && (
              <div data-h2-margin="base(x1, 0)">
                <MissingSkills
                  addedSkills={
                    hasResumeItems ? flattenExperienceSkills(experiences) : []
                  }
                  requiredSkills={missingSkills.requiredSkills}
                  optionalSkills={missingSkills.optionalSkills}
                />
              </div>
            )}
            <div data-h2-margin="base(x2, 0, x.5, 0)">
              <div
                data-h2-display="base(flex)"
                data-h2-justify-content="base(flex-end)"
              >
                <AddExperienceDialog
                  data-h2-flex-item="base(1of1)"
                  applicantId={applicantId}
                />
              </div>
            </div>
            {!hasResumeItems ? (
              <Well data-h2-text-align="base(center)">
                {intl.formatMessage({
                  defaultMessage: "You haven’t added any résumé items yet.",
                  id: "SjY+Wn",
                  description:
                    "Message to user when no résumé items have been attached to profile.",
                })}
              </Well>
            ) : (
              <ExperienceSection
                editParam={applicationParam}
                experiences={experiences}
                headingLevel="h2"
              />
            )}
          </TableOfContents.Section>
          <TableOfContents.Section
            id={PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES}
            data-h2-margin="base(x3, 0, 0, 0)"
          >
            <div data-h2-flex-grid="base(center, x1, x1)">
              <Heading
                Icon={IdentificationIcon}
                color="blue"
                data-h2-flex-item="base(1of1) p-tablet(fill)"
              >
                {intl.formatMessage(titles.qualifiedRecruitmentProcesses)}
              </Heading>
              <Link
                href={paths.browsePools()}
                data-h2-flex-item="base(1of1) p-tablet(content)"
              >
                Browse jobs
              </Link>
            </div>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "When you apply to a recruitment process and successfully pass the assessment, you’re awarded entry and can start being considered for related opportunities. This section highlights all active and expired processes that you’re currently a part of and allows you to manage whether or not you appear in talent searches.",
                id: "wrTfp3",
                description:
                  "Descriptive paragraph for the Qualified recruitment processes section of the résumé and recruitments page.",
              })}
            </p>
            {!hasQualifiedRecruitments ? (
              <Well data-h2-text-align="base(center)">
                <p
                  data-h2-font-weight="base(700)"
                  data-h2-margin-bottom="base(x.5)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "Recruitment processes that you're awarded entry into will appear here.",
                    id: "aW/Htv",
                    description:
                      "Message to user when no qualified recruitments have been attached to profile, paragraph one.",
                  })}
                </p>
                <a href={paths.browsePools()}>
                  {intl.formatMessage({
                    defaultMessage:
                      "You can get started by applying to available targeted or ongoing recruitment processes.",
                    id: "z7FpHz",
                    description:
                      "Message to user when no qualified recruitments have been attached to profile, paragraph two.",
                  })}
                </a>
              </Well>
            ) : (
              <span>TODO: qualified recruitments</span>
            )}
          </TableOfContents.Section>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </ProfileFormWrapper>
  );
};

export default ResumeAndRecruitments;
