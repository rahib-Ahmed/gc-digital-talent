import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";
import ChartPieIcon from "@heroicons/react/24/outline/ChartPieIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

import { TableOfContents, Pending, Link } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import SkillLibraryTable, {
  SkillLibraryTable_SkillFragment,
  SkillLibraryTable_UserSkillFragment,
} from "./components/SkillLibraryTable";

const SkillLibraryPage_Query = graphql(/* GraphQL */ `
  query SkillLibraryPageQuery {
    me {
      id
      userSkills {
        ...SkillLibraryTable_UserSkill
      }
    }
    skills {
      ...SkillLibraryTable_Skill
    }
  }
`);

interface PageSection {
  id: string;
  title: string;
}
type PageSections = Record<string, PageSection>;

interface SkillLibraryProps {
  userSkills: FragmentType<typeof SkillLibraryTable_UserSkillFragment>[];
  skills: FragmentType<typeof SkillLibraryTable_SkillFragment>[];
}

const SkillLibrary = ({ userSkills, skills }: SkillLibraryProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const sections: PageSections = {
    manage: {
      id: "manage",
      title: intl.formatMessage({
        defaultMessage: "Manage your skills",
        id: "Mz7sON",
        description: "Title for editing a users skills",
      }),
    },
    showcase: {
      id: "showcase",
      title: intl.formatMessage(navigationMessages.skillShowcase),
    },
  };

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: paths.profileAndApplications(),
      },
      {
        label: intl.formatMessage(navigationMessages.skillLibrary),
        url: paths.skillLibrary(),
      },
    ],
  });

  const pageTitle = intl.formatMessage(navigationMessages.skillLibrary);

  const pageDescription = intl.formatMessage({
    defaultMessage: "Add, edit, and manage the skills on your profile.",
    description: "Page description for the skill library page",
    id: "NlYIHM",
  });

  return (
    <>
      <SEO title={pageTitle} description={pageDescription} />
      <Hero title={pageTitle} subtitle={pageDescription} crumbs={crumbs} />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.manage.id}>
                  {sections.manage.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.showcase.id}>
                  {sections.showcase.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.manage.id}>
              <TableOfContents.Heading
                icon={BoltIcon}
                color="primary"
                data-h2-margin="base(0, 0, x1, 0)"
              >
                {sections.manage.title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x1, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "This section allows you to manage all the skills linked to your profile, experiences, and showcase. Select a skill's name to manage further details including your level and related career experiences.",
                  id: "Di1aEV",
                  description: "Description on how to use behavioural skills",
                })}
              </p>
              <SkillLibraryTable
                caption={sections.manage.title}
                userSkillsQuery={userSkills}
                allSkillsQuery={skills}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.showcase.id}>
              <TableOfContents.Heading
                icon={ChartPieIcon}
                color="error"
                data-h2-margin-top="base(x3)"
              >
                {sections.showcase.title}
              </TableOfContents.Heading>
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Your skill showcase allows you to curate lists of skills from your library that present a more targeted story about your strengths and areas of interest. While your skill library acts as a central place to manage all of the skills you add to your profile, the showcases you complete are paired with your job applications to help recruiters and managers see a more complete picture of your talent.",
                  id: "ccR/uJ",
                  description: "Description on what the skills showcase is.",
                })}
              </p>
              <Link color="secondary" mode="solid" href={paths.skillShowcase()}>
                {intl.formatMessage({
                  defaultMessage: "Visit your showcase",
                  id: "Y3rbFp",
                  description: "Link text to the skill showcase page.",
                })}
              </Link>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["UserSkill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
};

const SkillLibraryPage = () => {
  const [{ data, fetching, error }] = useQuery({
    query: SkillLibraryPage_Query,
    context,
  });

  const userSkills = unpackMaybes(data?.me?.userSkills);
  const skills = unpackMaybes(data?.skills);

  return (
    <Pending fetching={fetching} error={error}>
      <SkillLibrary userSkills={userSkills} skills={skills} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <SkillLibraryPage />
  </RequireAuth>
);

Component.displayName = "SkillLibraryPage";

export default SkillLibraryPage;
