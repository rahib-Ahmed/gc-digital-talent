import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useIntl } from "react-intl";
import { Bars3Icon } from "@heroicons/react/24/solid";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";
import { useLocalStorage } from "@gc-digital-talent/storage";
import {
  Button,
  SkipLink,
  SideMenuContentWrapper,
} from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";

import Footer from "~/components/Footer";
import Header from "~/components/Header";

import SEO, { Favicon } from "~/components/SEO/SEO";

import AdminSideMenu from "../AdminSideMenu/AdminSideMenu";

interface OpenMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  show: boolean;
}

const OpenMenuButton = ({ show, onClick, children }: OpenMenuButtonProps) => (
  <div
    data-h2-visually-hidden="base(visible) l-tablet(hidden)"
    data-h2-position="base(fixed)"
    data-h2-location="base(auto, x.25, x.25, auto)"
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

const AdminLayout = () => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme("admin", "light");
  }, [setTheme]);

  // retain menu preference in storage
  const [isMenuOpen, setMenuOpen] = useLocalStorage(
    "digitaltalent-menustate",
    true,
  );
  React.useEffect(() => {
    if (isSmallScreen) {
      setMenuOpen(false); // collapse menu if window resized to small
    }
  }, [isSmallScreen, setMenuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleDismiss = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <Favicon project="admin" />
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Admin",
          id: "wHX/8C",
          description: "Title tag for Admin site",
        })}
        description={intl.formatMessage({
          defaultMessage:
            "Recruit and manage IT employees in the Government of Canada.",
          id: "J8kIar",
          description: "Meta tag description for Admin site",
        })}
      />
      <SkipLink />
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
              data-h2-background-color="base(background)"
            >
              <div data-h2-min-height="base(100%)">
                <Outlet />
              </div>
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
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
};

export default AdminLayout;
