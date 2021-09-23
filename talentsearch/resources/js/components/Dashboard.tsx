import React, { ReactElement } from "react";
import { Routes } from "universal-router";
import { Link, RouterResult, useLocation, useRouter } from "../helpers/router";
import Footer from "./Footer";
import NavMenu from "./menu/NavMenu";

export const startsWith = (ref: string, test: string): boolean =>
  test.startsWith(ref);

interface MenuLinkProps {
  href: string;
  text: string;
  title?: string;
  isActive?: (href: string, path: string) => boolean;
}

export const MenuLink: React.FC<MenuLinkProps> = ({
  href,
  text,
  title,
  isActive = startsWith,
}) => {
  const location = useLocation();
  return (
    <Link href={href} title={title ?? ""}>
      <div
        data-h2-font-weight={
          isActive(href, location.pathname) ? "b(700)" : "b(100)"
        }
      >
        {text}
      </div>
    </Link>
  );
};

export const Dashboard: React.FC<{
  menuItems: ReactElement[];
  contentRoutes: Routes<RouterResult>;
}> = ({ menuItems, contentRoutes }) => {
  const content = useRouter(contentRoutes);
  return (
    <>
      <section>
        <NavMenu items={menuItems} />
      </section>
      <section>{content}</section>
      <section>
        <Footer />
      </section>
    </>
  );
};
