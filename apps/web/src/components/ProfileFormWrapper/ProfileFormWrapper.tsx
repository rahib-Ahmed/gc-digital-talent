import * as React from "react";
import { useIntl } from "react-intl";

import { BreadcrumbsProps } from "@gc-digital-talent/ui";
import { useAuthorization } from "@gc-digital-talent/auth";
import { useFeatureFlags } from "@gc-digital-talent/env";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";

import CancelButton from "./CancelButton";
import ProfileFormFooter from "./ProfileFormFooter";
import SaveButton from "./SaveButton";

const Wrapper = ({
  leaveRoomForNavigation,
  children,
}: {
  leaveRoomForNavigation?: boolean;
  children: React.ReactNode;
}) => {
  if (leaveRoomForNavigation)
    return (
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        {children}
      </div>
    );
  return (
    <section data-h2-margin="base(x3, 0)">
      <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
        {children}
      </div>
    </section>
  );
};
export interface ProfileFormWrapperProps {
  crumbs: BreadcrumbsProps["crumbs"];
  description?: React.ReactNode;
  title: string;
  metaTitle?: string; // Used to override <head><title /></head>
  children?: React.ReactNode;
  prefixBreadcrumbs?: boolean;
  leaveRoomForNavigation?: boolean; // less padding if it includes a NavigationWrapper
}

const ProfileFormWrapper = ({
  crumbs,
  description,
  title,
  metaTitle,
  children,
  prefixBreadcrumbs = true,
  leaveRoomForNavigation,
}: ProfileFormWrapperProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { user } = useAuthorization();
  const { applicantDashboard } = useFeatureFlags();
  const profileCrumb = applicantDashboard
    ? {
        label: intl.formatMessage({
          defaultMessage: "Profile and applications",
          id: "wDc+F3",
          description: "Breadcrumb for profile and applications page.",
        }),
        url: paths.profileAndApplications(),
      }
    : {
        label: intl.formatMessage({
          defaultMessage: "My profile",
          id: "+lKz3l",
          description: "Breadcrumb from applicant profile wrapper.",
        }),
        url: user?.id ? paths.profile(user.id) : paths.myProfile(),
      };

  let links = [...crumbs];
  if (prefixBreadcrumbs) {
    links = [
      {
        label: intl.formatMessage({
          defaultMessage: "Home",
          id: "EBmWyo",
          description: "Link text for the home link in breadcrumbs.",
        }),
        url: paths.home(),
      },
      profileCrumb,
      ...links,
    ];
  }

  return (
    <>
      <SEO title={metaTitle || title} />
      <Hero title={title} subtitle={description} crumbs={links} />
      <Wrapper leaveRoomForNavigation={leaveRoomForNavigation}>
        {children}
      </Wrapper>
    </>
  );
};

export { CancelButton, ProfileFormFooter, SaveButton };
export default ProfileFormWrapper;
