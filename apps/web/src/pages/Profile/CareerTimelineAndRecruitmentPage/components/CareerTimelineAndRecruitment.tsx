import React from "react";
import { useIntl } from "react-intl";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { TableOfContents, Heading, Link } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import MissingSkills from "~/components/MissingSkills";
import { flattenExperienceSkills } from "~/types/experience";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  Skill,
  WorkExperience,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import { Application } from "~/utils/applicationUtils";

import CareerTimelineSection from "./CareerTimelineSection";
import { PAGE_SECTION_ID, titles } from "../constants";
import QualifiedRecruitmentsSection from "./QualifiedRecruitmentsSection";

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

interface CareerTimelineAndRecruitmentProps {
  applicantId: string;
  experiences?: MergedExperiences;
  applications: Application[];
  missingSkills?: {
    requiredSkills: Skill[];
    optionalSkills: Skill[];
  };
}

const CareerTimelineAndRecruitment = ({
  experiences,
  applications,
  missingSkills,
  applicantId,
}: CareerTimelineAndRecruitmentProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const hasCareerTimelineItems = !!experiences?.length;

  const crumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: paths.home(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Profile and applications",
        id: "wDc+F3",
        description: "Breadcrumb for profile and applications page.",
      }),
      url: paths.profileAndApplications(),
    },
    {
      label: intl.formatMessage(titles.careerTimelineAndRecruitment),
      url: paths.careerTimelineAndRecruitment(applicantId),
    },
  ];

  const pageTitle = intl.formatMessage(titles.careerTimelineAndRecruitment);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage(
          {
            defaultMessage:
              "Manage your experience and qualified recruitment processes.",
            id: "zJKngJ",
            description:
              "Description for the Career timeline and recruitment page in applicant profile.",
          },
          {
            abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
          },
        )}
        crumbs={crumbs}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.MANAGE_YOUR_CAREER_TIMELINE}
                >
                  {intl.formatMessage(titles.manageYourCareerTimeline)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES}
                >
                  {intl.formatMessage(titles.qualifiedRecruitmentProcesses)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.MANAGE_YOUR_CAREER_TIMELINE}
            >
              <Heading
                Icon={BookmarkSquareIcon}
                color="tertiary"
                data-h2-margin-top="base(0)"
              >
                {intl.formatMessage(titles.manageYourCareerTimeline)}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This section is similar to your traditional career timeline and describes your experiences across work, school, and life. You’ll be able to reuse this information on each application you submit on the platform, speeding up the process and ensuring that your information is always up-to-date.",
                  id: "dAGii/",
                  description:
                    "Descriptive paragraph for the Manage your career timeline section of the career timeline and recruitment page.",
                })}
              </p>
              {missingSkills && (
                <div data-h2-margin="base(x1, 0)">
                  <MissingSkills
                    addedSkills={
                      hasCareerTimelineItems
                        ? flattenExperienceSkills(experiences)
                        : []
                    }
                    requiredSkills={missingSkills.requiredSkills}
                    optionalSkills={missingSkills.optionalSkills}
                  />
                </div>
              )}
              <div data-h2-margin-top="base(x2)">
                <CareerTimelineSection
                  experiences={experiences}
                  applicantId={applicantId}
                />
              </div>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES}
              data-h2-margin="base(x3, 0, 0, 0)"
            >
              <div data-h2-flex-grid="base(center, x1, x1)">
                <Heading
                  Icon={IdentificationIcon}
                  color="secondary"
                  data-h2-flex-item="base(1of1) p-tablet(fill)"
                >
                  {intl.formatMessage(titles.qualifiedRecruitmentProcesses)}
                </Heading>
                <Link
                  href={paths.browsePools()}
                  data-h2-flex-item="base(1of1) p-tablet(content)"
                  mode="inline"
                >
                  {intl.formatMessage({
                    defaultMessage: "Browse jobs",
                    id: "ApyEMy",
                    description: "Title for the browse pools page",
                  })}
                </Link>
              </div>
              <p data-h2-margin="base(x1, 0, x2, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "When you apply to a recruitment process and successfully pass the assessment, you’re awarded entry and can start being considered for related opportunities. This section highlights all active and expired processes that you’re currently a part of and allows you to manage whether or not you appear in talent searches.",
                  id: "4r4MJP",
                  description:
                    "Descriptive paragraph for the Qualified recruitment processes section of the career timeline and recruitment page.",
                })}
              </p>
              <QualifiedRecruitmentsSection applications={applications} />
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

export default CareerTimelineAndRecruitment;
