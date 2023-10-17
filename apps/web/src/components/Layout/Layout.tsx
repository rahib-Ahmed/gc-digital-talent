import React from "react";
import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration, useSearchParams } from "react-router-dom";

import { MenuLink } from "@gc-digital-talent/ui";
import {
  useAuthentication,
  useAuthorization,
  ROLE_NAME,
  hasRole,
} from "@gc-digital-talent/auth";
import { useLocale } from "@gc-digital-talent/i18n";

import SEO, { Favicon } from "~/components/SEO/SEO";
import NavMenu from "~/components/NavMenu/NavMenu";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import SignOutConfirmation from "~/components/SignOutConfirmation/SignOutConfirmation";
import useRoutes from "~/hooks/useRoutes";
import useLayoutTheme from "~/hooks/useLayoutTheme";
import authMessages from "~/messages/authMessages";

import IAPNavMenu from "../NavMenu/IAPNavMenu";
import LogoutButton from "./LogoutButton";
import MaintenanceBanner from "./MaintenanceBanner";
import SkipLink from "./SkipLink";

const Layout = () => {
  const intl = useIntl();
  const { locale } = useLocale();
  const paths = useRoutes();
  useLayoutTheme("default");

  const { user } = useAuthorization();
  const { loggedIn } = useAuthentication();

  const [searchParams] = useSearchParams();

  const iapPersonality = searchParams.get("personality") === "iap";

  let menuItems = [
    <MenuLink key="home" to={paths.home()} end>
      {intl.formatMessage({
        defaultMessage: "Home",
        id: "G1RNXj",
        description: "Link to the Homepage in the nav menu.",
      })}
    </MenuLink>,
    <MenuLink key="search" to={paths.search()}>
      {intl.formatMessage({
        defaultMessage: "Find talent",
        id: "NohOkF",
        description: "Label displayed on the Find talent menu item.",
      })}
    </MenuLink>,
    <MenuLink key="browseJobs" to={paths.browsePools()}>
      {intl.formatMessage({
        defaultMessage: "Browse jobs",
        id: "7GrHDl",
        description: "Label displayed on the browse pools menu item.",
      })}
    </MenuLink>,
  ];

  let authLinks = [
    <MenuLink key="sign-in" to={paths.login()}>
      {intl.formatMessage(authMessages.signIn)}
    </MenuLink>,
    <MenuLink key="sign-up" to={paths.register()}>
      {intl.formatMessage(authMessages.signUp)}
    </MenuLink>,
  ];

  if (loggedIn && user) {
    const userRoleNames = user?.roleAssignments?.map((a) => a.role?.name);

    if (
      [
        ROLE_NAME.PoolOperator,
        ROLE_NAME.RequestResponder,
        ROLE_NAME.PlatformAdmin,
      ].some(
        (authorizedRoleName) => userRoleNames?.includes(authorizedRoleName),
      )
    ) {
      menuItems = [
        ...menuItems,
        <MenuLink key="adminDashboard" to={paths.adminDashboard()}>
          {intl.formatMessage({
            defaultMessage: "Admin",
            id: "wHX/8C",
            description: "Title tag for Admin site",
          })}
        </MenuLink>,
      ];
    }
    authLinks = [
      <SignOutConfirmation key="sign-out">
        <LogoutButton>{intl.formatMessage(authMessages.signOut)}</LogoutButton>
      </SignOutConfirmation>,
    ];

    if (hasRole(ROLE_NAME.Applicant, user.roleAssignments)) {
      authLinks = [
        <MenuLink
          key="profile-applications"
          to={paths.profileAndApplications()}
        >
          {intl.formatMessage({
            defaultMessage: "Profile and applications",
            id: "nBoNqj",
            description:
              "Label displayed on the profile and applications menu item.",
          })}
        </MenuLink>,
        ...authLinks,
      ];
    }
  }

  return (
    <>
      <Favicon locale={locale} project="digital-talent" />
      <SEO
        title={intl.formatMessage({
          defaultMessage: "GC Digital Talent",
          id: "Mz+gUV",
          description: "Title tag for Talent Search site",
        })}
        description={intl.formatMessage({
          defaultMessage:
            "GC Digital Talent is the new recruitment platform for digital and tech jobs in the Government of Canada. Apply now!",
          id: "jRmRd+",
          description: "Meta tag description for Talent Search site",
        })}
      />
      <SkipLink />
      <div
        className="container"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-min-height="base(100vh)"
        data-h2-margin="base(0)"
        data-h2-color="base(black) base:dark(white)"
      >
        <div>
          <Header />
          <MaintenanceBanner />
          {!iapPersonality ? (
            <NavMenu mainItems={menuItems} utilityItems={authLinks} />
          ) : (
            <IAPNavMenu {...{ loggedIn, user }} />
          )}
        </div>
        <main id="main">
          <Outlet />
        </main>
        <div style={{ marginTop: "auto" }}>
          <Footer />
        </div>
      </div>
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
};

export default Layout;
