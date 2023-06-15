import React from "react";
import { useIntl } from "react-intl";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";

import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import profileMessages from "~/messages/profileMessages";
import { Applicant, useGetMeQuery, User, GetMeQuery } from "~/api/generated";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import UserProfile from "~/components/UserProfile";
import SEO from "~/components/SEO/SEO";
import LanguageInformationSection from "~/components/UserProfile/ProfileSections/LanguageInformationSection";
import ExperienceSection from "~/components/UserProfile/ExperienceSection";
import MyStatusApi from "./components/MyStatusForm/MyStatusForm";

export interface ProfilePageProps {
  profileDataInput: User;
}

export const ProfileForm = ({ profileDataInput }: ProfilePageProps) => {
  const { id: userId, experiences } = profileDataInput;
  const paths = useRoutes();

  const intl = useIntl();
  const featureFlags = useFeatureFlags();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Profile information",
    id: "gTjLic",
    description: "applicant dashboard card title for profile card",
  });

  const thisCrumb = {
    label: pageTitle,
    url: paths.profile(userId),
  };
  const crumbs = useBreadcrumbs(
    featureFlags.applicantDashboard
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Profile and applications",
              id: "76KLtb",
              description:
                "Label displayed on the applicant dashboard menu item.",
            }),
            url: paths.dashboard(),
          },
          thisCrumb,
        ]
      : [thisCrumb],
  );

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "View and update account information including contact and work preferences.",
          id: "NflJW7",
          description: "subtitle for the profile page",
        })}
        crumbs={crumbs}
      />
      <UserProfile
        applicant={profileDataInput as Applicant}
        sections={{
          myStatus: {
            isVisible: !featureFlags.applicantDashboard,
            override: <MyStatusApi />,
          },
          about: { isVisible: true, editUrl: paths.aboutMe(userId) },
          language: {
            isVisible: true,
            editUrl: paths.languageInformation(userId),
            override: (
              <LanguageInformationSection
                applicant={profileDataInput as Applicant}
                editPath={paths.languageInformation(userId)}
              />
            ),
          },
          government: {
            isVisible: true,
            editUrl: paths.governmentInformation(userId),
          },
          workLocation: {
            isVisible: true,
            editUrl: paths.workLocation(userId),
          },
          workPreferences: {
            isVisible: true,
            editUrl: paths.workPreferences(userId),
          },
          employmentEquity: {
            isVisible: true,
            editUrl: paths.diversityEquityInclusion(userId),
          },
          roleSalary: { isVisible: true, editUrl: paths.roleSalary(userId) },
          skillsExperience: {
            isVisible: !featureFlags.applicantDashboard,
            editUrl: paths.skillsAndExperiences(userId),
            override: (
              <ExperienceSection
                experiences={experiences?.filter(notEmpty)}
                editPath={paths.skillsAndExperiences(userId)}
              />
            ),
          },
        }}
      />
    </>
  );
};

const ProfilePage = () => {
  const intl = useIntl();
  const [result] = useGetMeQuery();
  const { data, fetching, error } = result;

  // type magic on data variable to make it end up as a valid User type
  const dataToUser = (input: GetMeQuery): User | undefined => {
    if (input) {
      if (input.me) {
        return input.me;
      }
    }
    return undefined;
  };
  const userData = data ? dataToUser(data) : undefined;

  return (
    <Pending fetching={fetching} error={error}>
      {userData ? (
        <ProfileForm profileDataInput={userData} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default ProfilePage;
