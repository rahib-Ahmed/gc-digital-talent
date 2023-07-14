import * as React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import {
  NotFound,
  Pending,
  ToggleGroup,
  TableOfContents,
  Separator,
  TreeView,
  Heading,
  CardBasic,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  getEducationRequirementOption,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import PageHeader from "~/components/PageHeader";
import {
  Applicant,
  Scalars,
  useGetPoolCandidateSnapshotQuery,
  PoolCandidate,
  Maybe,
  SkillCategory,
  User,
  Pool,
} from "~/api/generated";
import {
  getFullPoolTitleHtml,
  getFullPoolTitleLabel,
  useAdminPoolPages,
} from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import { categorizeSkill } from "~/utils/skillUtils";
import adminMessages from "~/messages/adminMessages";
import applicationMessages from "~/messages/applicationMessages";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import ExperienceTreeItems from "~/components/ExperienceTreeItems/ExperienceTreeItems";
import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";

import ApplicationStatusForm from "./components/ApplicationStatusForm";
import ResumeSection from "./components/ResumeSection/ResumeSection";
import SkillTree from "../../Applications/ApplicationSkillsPage/components/SkillTree";
import PersonalInformationDisplay from "../../Applications/ApplicationProfilePage/components/PersonalInformation/Display";
import DiversityEquityInclusionDisplay from "../../Applications/ApplicationProfilePage/components/DiversityEquityInclusion/Display";
import GovernmentInformationDisplay from "../../Applications/ApplicationProfilePage/components/GovernmentInformation/Display";
import LanguageProfileDisplay from "../../Applications/ApplicationProfilePage/components/LanguageProfile/Display";
import WorkPreferencesDisplay from "../../Applications/ApplicationProfilePage/components/WorkPreferences/Display";
import AssetSkillsFiltered from "./components/ApplicationStatusForm/AssetSkillsFiltered";

export interface ViewPoolCandidateProps {
  poolCandidate: PoolCandidate;
  pools: Pool[];
}

type SectionContent = {
  id: string;
  linkText?: string;
  title: string;
};

export const ViewPoolCandidate = ({
  poolCandidate,
  pools,
}: ViewPoolCandidateProps): JSX.Element => {
  const intl = useIntl();

  // prefer the rich view if available
  const [preferRichView, setPreferRichView] = React.useState(true);

  const parsedSnapshot: Maybe<Applicant> = JSON.parse(
    poolCandidate.profileSnapshot,
  );
  const snapshotUserPropertyExists = !!parsedSnapshot;
  const pages = useAdminPoolPages(intl, poolCandidate.pool);
  const showRichSnapshot = snapshotUserPropertyExists && preferRichView;

  const sections: Record<string, SectionContent> = {
    statusForm: {
      id: "status-form",
      title: intl.formatMessage({
        defaultMessage: "Application status",
        id: "/s66sg",
        description: "Title for admins to edit an applications status.",
      }),
    },
    poolInformation: {
      id: "pool-information",
      title: intl.formatMessage({
        defaultMessage: "Pool information",
        id: "Cjp2F6",
        description: "Title for the pool info page",
      }),
    },
    snapshot: {
      id: "snapshot",
      title: intl.formatMessage({
        defaultMessage: "Application",
        id: "5iNcHS",
        description:
          "Title displayed for the Pool Candidates table View Application link.",
      }),
    },
    minExperience: {
      id: "min-experience",
      title: intl.formatMessage({
        defaultMessage: "Minimum experience or equivalent education",
        id: "Fbh/MK",
        description:
          "Title for the minimum experience or equivalent education snapshot section.",
      }),
    },
    essentialSkills: {
      id: "essential-skills",
      title: intl.formatMessage({
        defaultMessage: "Essential skills",
        id: "w7E0He",
        description: "Title for the required skills snapshot section",
      }),
    },
    assetSkills: {
      id: "asset-skills",
      title: intl.formatMessage({
        defaultMessage: "Asset skills",
        id: "Xpo+u6",
        description: "Title for the optional skills snapshot section",
      }),
    },
    questions: {
      id: "questions",
      title: intl.formatMessage({
        defaultMessage: "Screening questions",
        id: "mqWvWR",
        description: "Title for the screening questions snapshot section",
      }),
    },
    careerTimeline: {
      id: "career-timeline",
      title: intl.formatMessage({
        defaultMessage: "Career timeline",
        id: "2KM4iz",
        description: "Title for the career timeline snapshot section",
      }),
    },
    personal: {
      id: "personal",
      title: intl.formatMessage({
        defaultMessage: "Personal and contact information",
        id: "0lUoqK",
        description:
          "Title for the personal and contact information snapshot section",
      }),
    },
    work: {
      id: "work",
      title: intl.formatMessage({
        defaultMessage: "Work preferences",
        id: "s7F24X",
        description: "Title for the work preferences snapshot section",
      }),
    },
    dei: {
      id: "dei",
      title: intl.formatMessage({
        defaultMessage: "Diversity, equity, and inclusion",
        id: "zLeH2i",
        description:
          "Title for the diversity, equity, and inclusion snapshot section",
      }),
    },
    government: {
      id: "government",
      title: intl.formatMessage({
        defaultMessage: "Government employee information",
        id: "nEVNHp",
        description:
          "Title for the government employee information snapshot section",
      }),
    },
    language: {
      id: "language",
      title: intl.formatMessage({
        defaultMessage: "Language profile",
        id: "KsS1Py",
        description: "Title for the language profile snapshot section",
      }),
    },
    signature: {
      id: "signature",
      title: intl.formatMessage({
        defaultMessage: "Signature",
        id: "1ZZgbi",
        description: "Title for the signature snapshot section",
      }),
    },
  };

  const subTitle = (
    <TableOfContents.Section id={sections.snapshot.id}>
      <div
        data-h2-display="l-tablet(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-margin="base(x1, 0)"
      >
        {snapshotUserPropertyExists && (
          <>
            <TableOfContents.Heading
              as="h3"
              data-h2-margin="base(0)"
              data-h2-font-weight="base(800)"
            >
              {sections.snapshot.title}
            </TableOfContents.Heading>
            <ToggleGroup.Root
              type="single"
              color="primary.dark"
              value={preferRichView ? "text" : "code"}
              onValueChange={(value) => {
                if (value) setPreferRichView(value === "text");
              }}
            >
              <ToggleGroup.Item value="text">
                {intl.formatMessage({
                  defaultMessage: "Text",
                  id: "Ude1JQ",
                  description: "Title for the application's profile snapshot.",
                })}
              </ToggleGroup.Item>
              <ToggleGroup.Item value="code">
                {intl.formatMessage({
                  defaultMessage: "Code",
                  id: "m0JFE/",
                  description: "Title for the application's profile snapshot.",
                })}
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </>
        )}
      </div>
    </TableOfContents.Section>
  );

  let mainContent: React.ReactNode;
  if (showRichSnapshot) {
    const snapshotCandidate = parsedSnapshot?.poolCandidates
      ?.filter(notEmpty)
      .find(({ id }) => id === poolCandidate.id);
    const categorizedEssentialSkills = categorizeSkill(
      poolCandidate.pool.essentialSkills,
    );
    const categorizedAssetSkills = categorizeSkill(
      poolCandidate.pool.nonessentialSkills,
    );
    const nonEmptyExperiences = parsedSnapshot.experiences?.filter(notEmpty);

    mainContent = (
      <>
        {subTitle}
        <TableOfContents.Section id={sections.minExperience.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.minExperience.title}
          </TableOfContents.Heading>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Requirement selection: <strong>{educationRequirementOption}</strong>.",
                id: "J3Ud6R",
                description:
                  "Application snapshot minimum experience section description",
              },
              {
                educationRequirementOption: intl.formatMessage(
                  snapshotCandidate?.educationRequirementOption
                    ? getEducationRequirementOption(
                        snapshotCandidate.educationRequirementOption,
                      )
                    : commonMessages.notAvailable,
                ),
              },
            )}
          </p>
          {snapshotCandidate?.educationRequirementExperiences?.length ? (
            <>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Demonstrated with the following experiences:",
                  id: "tpTntk",
                  description:
                    "Lead in text for experiences that demonstrate minimum education experience",
                })}
              </p>
              <TreeView.Root>
                <ExperienceTreeItems
                  experiences={snapshotCandidate?.educationRequirementExperiences.filter(
                    notEmpty,
                  )}
                />
              </TreeView.Root>
            </>
          ) : null}
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.essentialSkills.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.essentialSkills.title}
          </TableOfContents.Heading>
          {categorizedEssentialSkills[SkillCategory.Technical]?.length ? (
            <>
              <p>
                {intl.formatMessage({
                  defaultMessage: "Represented by the following experiences:",
                  id: "mDowK/",
                  description:
                    "Lead in text for experiences that represent the users skills",
                })}
              </p>
              {categorizedEssentialSkills[SkillCategory.Technical]?.map(
                (requiredTechnicalSkill) => (
                  <SkillTree
                    key={requiredTechnicalSkill.id}
                    skill={requiredTechnicalSkill}
                    experiences={
                      parsedSnapshot.experiences?.filter(notEmpty) || []
                    }
                    showDisclaimer
                    hideConnectButton
                    hideEdit
                    disclaimerMessage={
                      <p>
                        {intl.formatMessage({
                          defaultMessage:
                            "There are no experiences attached to this skill.",
                          id: "XrfkBm",
                          description:
                            "Message displayed when no experiences have been attached to a skill",
                        })}
                      </p>
                    }
                  />
                ),
              )}
            </>
          ) : null}
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.assetSkills.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.assetSkills.title}
          </TableOfContents.Heading>
          {categorizedAssetSkills[SkillCategory.Technical]?.length ? (
            <AssetSkillsFiltered
              poolAssetSkills={categorizedAssetSkills[SkillCategory.Technical]}
              experiences={parsedSnapshot.experiences?.filter(notEmpty) || []}
            />
          ) : null}
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.questions.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.questions.title}
          </TableOfContents.Heading>
          {snapshotCandidate?.screeningQuestionResponses
            ?.filter(notEmpty)
            .map((response) => (
              <React.Fragment key={response.id}>
                <Heading level="h5" size="h6" data-h2-margin-bottom="base(x.5)">
                  {getLocalizedName(
                    response?.screeningQuestion?.question,
                    intl,
                  )}
                </Heading>
                <div
                  data-h2-background-color="base(white) base:dark(black)"
                  data-h2-padding="base(x1)"
                  data-h2-border-left="base(x.5 solid primary)"
                  data-h2-radius="base(0 rounded rounded 0)"
                  data-h2-shadow="base(medium)"
                >
                  <p>{response.answer}</p>
                </div>
              </React.Fragment>
            ))}
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.careerTimeline.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.careerTimeline.title}
          </TableOfContents.Heading>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "The following is the applicant's career timeline:",
              id: "ghcC8V",
              description:
                "Lead-in text for the snapshot career timeline section",
            })}
          </p>
          <ResumeSection experiences={nonEmptyExperiences ?? []} />
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.personal.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.personal.title}
          </TableOfContents.Heading>
          <CardBasic>
            <PersonalInformationDisplay user={parsedSnapshot as User} />
          </CardBasic>
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.work.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.work.title}
          </TableOfContents.Heading>
          <CardBasic>
            <WorkPreferencesDisplay user={parsedSnapshot as User} />
          </CardBasic>
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.dei.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.dei.title}
          </TableOfContents.Heading>
          <CardBasic>
            <DiversityEquityInclusionDisplay user={parsedSnapshot as User} />
          </CardBasic>
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.government.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.government.title}
          </TableOfContents.Heading>
          <CardBasic>
            <GovernmentInformationDisplay user={parsedSnapshot as User} />
          </CardBasic>
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.language.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.language.title}
          </TableOfContents.Heading>
          <CardBasic>
            <LanguageProfileDisplay user={parsedSnapshot as User} />
          </CardBasic>
        </TableOfContents.Section>
        <TableOfContents.Section id={sections.signature.id}>
          <TableOfContents.Heading
            as="h4"
            size="h5"
            data-h2-margin="base(x2 0 x.5 0)"
          >
            {sections.signature.title}
          </TableOfContents.Heading>
          <p data-h2-margin="base(0, 0, x1, 0)">
            {intl.formatMessage(applicationMessages.confirmationLead)}
          </p>
          <ul>
            <li>
              {intl.formatMessage(applicationMessages.confirmationReview)}
            </li>
            <li>
              {intl.formatMessage(applicationMessages.confirmationCommunity)}
            </li>
            <li>{intl.formatMessage(applicationMessages.confirmationTrue)}</li>
          </ul>
          <Heading
            level="h6"
            data-h2-font-size="base(copy)"
            data-h2-font-weight="base(400)"
          >
            {intl.formatMessage({
              defaultMessage: "Signed",
              id: "fEcEv3",
              description:
                "Heading for the application snapshot users signature",
            })}
          </Heading>
          <CardBasic data-h2-shadow="base(none)">
            <p data-h2-font-weight="base(700)">
              {snapshotCandidate?.signature ||
                intl.formatMessage(commonMessages.notProvided)}
            </p>
          </CardBasic>
        </TableOfContents.Section>
      </>
    );
  } else if (snapshotUserPropertyExists && !preferRichView) {
    mainContent = (
      <>
        {subTitle}
        <pre
          data-h2-background-color="base(background.dark.3)"
          data-h2-border="base(1px solid background.darker)"
          data-h2-overflow="base(scroll auto)"
          data-h2-padding="base(x1)"
          data-h2-radius="base(s)"
        >
          {JSON.stringify(parsedSnapshot, null, 2)}
        </pre>
      </>
    );
  } else {
    mainContent = (
      <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
        <p>
          {intl.formatMessage({
            defaultMessage: "Profile snapshot not found.",
            id: "JH2+tK",
            description: "Message displayed for profile snapshot not found.",
          })}
        </p>
      </NotFound>
    );
  }

  return (
    <>
      <PageHeader
        icon={UserCircleIcon}
        subtitle={`${poolCandidate.user.firstName} ${
          poolCandidate.user.lastName
        } / ${getFullPoolTitleLabel(intl, poolCandidate.pool)}`}
        navItems={pages}
      >
        {intl.formatMessage({
          defaultMessage: "Candidate information",
          id: "69/cNW",
          description:
            "Heading displayed above the pool candidate application page.",
        })}
      </PageHeader>
      <p data-h2-margin="base(-x1, 0, x1, 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "This is the profile submitted on <strong>{submittedAt}</strong> for the pool: <strong>{poolName}</strong>",
            id: "V2vBbu",
            description:
              "Snapshot details displayed above the pool candidate application page.",
          },
          {
            submittedAt: poolCandidate.submittedAt,
            poolName: getFullPoolTitleHtml(intl, poolCandidate.pool),
          },
        )}
      </p>
      <Separator
        data-h2-background-color="base(black.lightest)"
        data-h2-margin="base(x1, 0, 0, 0)"
      />
      <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={sections.statusForm.id}>
                {sections.statusForm.title}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={sections.poolInformation.id}>
                {sections.poolInformation.title}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={sections.snapshot.id}>
                {sections.snapshot.title}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            {showRichSnapshot && (
              <>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.minExperience.id}>
                    {sections.minExperience.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.essentialSkills.id}>
                    {sections.essentialSkills.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.assetSkills.id}>
                    {sections.assetSkills.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.questions.id}>
                    {sections.questions.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.careerTimeline.id}>
                    {sections.careerTimeline.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.personal.id}>
                    {sections.personal.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.work.id}>
                    {sections.work.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.dei.id}>
                    {sections.dei.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.government.id}>
                    {sections.government.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.language.id}>
                    {sections.language.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.signature.id}>
                    {sections.signature.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              </>
            )}
          </TableOfContents.List>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <TableOfContents.Section id={sections.statusForm.id}>
            <TableOfContents.Heading
              data-h2-margin="base(0, 0, x1, 0)"
              data-h2-font-weight="base(800)"
              as="h3"
            >
              {sections.statusForm.title}
            </TableOfContents.Heading>
            <ApplicationStatusForm id={poolCandidate.id} />
            <Separator
              data-h2-background-color="base(black.lightest)"
              data-h2-margin="base(x1, 0, 0, 0)"
            />
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.poolInformation.id}>
            <TableOfContents.Heading
              data-h2-margin="base(x1, 0, x1, 0)"
              data-h2-font-weight="base(800)"
              as="h3"
            >
              {sections.poolInformation.title}
            </TableOfContents.Heading>
            <PoolStatusTable user={poolCandidate.user} pools={pools} />
            <Separator
              data-h2-background-color="base(black.lightest)"
              data-h2-margin="base(x1, 0, 0, 0)"
            />
          </TableOfContents.Section>
          {mainContent}
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </>
  );
};

type RouteParams = {
  poolId: Scalars["ID"];
  poolCandidateId: Scalars["ID"];
};

export const ViewPoolCandidatePage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { poolCandidateId } = useParams<RouteParams>();
  const [{ data, fetching, error }] = useGetPoolCandidateSnapshotQuery({
    variables: { poolCandidateId: poolCandidateId || "" },
  });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.pools),
      url: routes.poolTable(),
    },
    ...(data?.poolCandidate?.pool.id
      ? [
          {
            label: getLocalizedName(data.poolCandidate.pool.name, intl),
            url: routes.poolView(data.poolCandidate.pool.id),
          },
        ]
      : []),
    ...(data?.poolCandidate?.pool.id
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Candidates",
              id: "zzf16k",
              description: "Breadcrumb for the All Candidates page",
            }),
            url: routes.poolCandidateTable(data.poolCandidate.pool.id),
          },
        ]
      : []),
    ...(poolCandidateId
      ? [
          {
            label: getFullNameLabel(
              data?.poolCandidate?.user.firstName,
              data?.poolCandidate?.user.lastName,
              intl,
            ),
            url: routes.poolCandidateApplication(poolCandidateId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending fetching={fetching} error={error}>
        {data?.poolCandidate && data?.pools ? (
          <ViewPoolCandidate
            poolCandidate={data.poolCandidate}
            pools={data.pools.filter(notEmpty)}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Candidate {poolCandidateId} not found.",
                  id: "GrfidX",
                  description:
                    "Message displayed for pool candidate not found.",
                },
                { poolCandidateId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default ViewPoolCandidatePage;
