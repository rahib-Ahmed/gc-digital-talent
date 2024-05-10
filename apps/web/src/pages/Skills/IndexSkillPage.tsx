import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import LightBulbOutlineIcon from "@heroicons/react/24/outline/LightBulbIcon";
import LightBulbSolidIcon from "@heroicons/react/24/solid/LightBulbIcon";

import { IconType } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import AdminHero from "~/components/Hero/AdminHero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import SkillTableApi from "./components/SkillTable";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Skills editor",
  id: "8ioBIZ",
  description: "Title for skills editor",
});
export const pageSolidIcon: IconType = LightBulbSolidIcon;
export const pageOutlineIcon: IconType = LightBulbOutlineIcon;

export const IndexSkillPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.skillTable(),
      },
    ],
    isAdmin: true,
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <SkillTableApi title={formattedPageTitle} addButton />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <IndexSkillPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexSkillPage";

export default IndexSkillPage;
