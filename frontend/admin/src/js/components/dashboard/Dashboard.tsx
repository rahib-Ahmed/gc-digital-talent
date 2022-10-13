import React from "react";
import { useIntl } from "react-intl";
import { Bars3Icon } from "@heroicons/react/24/outline";

import { useRouter, RouterResult } from "@common/helpers/router";
import { Routes } from "universal-router";
import { Button } from "@common/components";
import NotFound from "@common/components/NotFound";
import Header from "@common/components/Header";
import Footer from "@common/components/Footer";
import useIsSmallScreen from "@common/hooks/useIsSmallScreen";
import { SideMenuContentWrapper } from "@common/components/SideMenu";
import NotAuthorized from "@common/components/NotAuthorized";

import AdminSideMenu from "../menu/AdminSideMenu";

const AdminNotFound: React.FC = () => {
  const intl = useIntl();
  return (
    <NotFound
      headingMessage={intl.formatMessage({
        description: "Heading for the message saying the page was not found.",
        defaultMessage: "Sorry, we can't find the page you were looking for.",
        id: "pBJzgi",
      })}
    >
      <p>
        {intl.formatMessage({
          description: "Detailed message saying the page was not found.",
          defaultMessage:
            "Oops, it looks like you've landed on a page that either doesn't exist or has moved.",
          id: "pgHTkX",
        })}
      </p>
    </NotFound>
  );
};

const AdminNotAuthorized: React.FC = () => {
  const intl = useIntl();
  return (
    <NotAuthorized
      headingMessage={intl.formatMessage({
        description:
          "Heading for the message saying the page to view is not authorized.",
        defaultMessage: "Sorry, you are not authorized to view this page.",
        id: "jPLaDk",
      })}
    >
      <p>
        {intl.formatMessage({
          description:
            "Detailed message saying the page to view is not authorized.",
          defaultMessage:
            "Oops, it looks like you've landed on a page that you are not authorized to view.",
          id: "gKyog2",
        })}
      </p>
    </NotAuthorized>
  );
};

interface OpenMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  show: boolean;
}

const OpenMenuButton: React.FC<OpenMenuButtonProps> = ({
  show,
  onClick,
  children,
}) => (
  <div
    data-h2-visibility="base(visible) l-tablet(hidden)"
    data-h2-position="base(fixed)"
    data-h2-offset="base(auto, x.25, x.25, auto)"
    style={{ zIndex: 9998, opacity: show ? 1 : 0 }}
  >
    <Button
      mode="solid"
      color="secondary"
      data-h2-display="base(inline-flex)"
      data-h2-align-items="base(center)"
      data-h2-shadow="base(s)"
      onClick={onClick}
    >
      <Bars3Icon
        style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }}
      />
      <span>{children}</span>
    </Button>
  </div>
);

interface DashboardProps {
  contentRoutes: Routes<RouterResult>;
}

const notFound = <AdminNotFound />;
const notAuthorized = <AdminNotAuthorized />;

const Dashboard: React.FC<DashboardProps> = ({ contentRoutes }) => {
  const isSmallScreen = useIsSmallScreen();
  const [isMenuOpen, setMenuOpen] = React.useState(!isSmallScreen);
  const intl = useIntl();
  const content = useRouter({
    routes: contentRoutes,
    components: {
      notFound,
      notAuthorized,
    },
  });

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleDismiss = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <a href="#main" data-h2-visibility="base(hidden)">
        {intl.formatMessage({
          defaultMessage: "Skip to main content",
          id: "Srs7a4",
          description: "Assistive technology skip link",
        })}
      </a>

      <div data-h2-flex-grid="base(stretch, 0)">
        <AdminSideMenu
          isOpen={isMenuOpen}
          onToggle={handleMenuToggle}
          onDismiss={handleDismiss}
        />
        <SideMenuContentWrapper>
          <div
            data-h2-min-height="base(100%)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <Header width="full" />
            <main
              id="main"
              data-h2-flex-grow="base(1)"
              data-h2-background-color="base(dt-gray.15)"
            >
              {content}
            </main>
            <Footer width="full" />
          </div>
        </SideMenuContentWrapper>
      </div>
      <OpenMenuButton onClick={handleMenuToggle} show={!isMenuOpen}>
        {intl.formatMessage({
          defaultMessage: "Open Menu",
          id: "crzWxb",
          description: "Text label for header button that opens side menu.",
        })}
      </OpenMenuButton>
    </>
  );
};

export default Dashboard;
