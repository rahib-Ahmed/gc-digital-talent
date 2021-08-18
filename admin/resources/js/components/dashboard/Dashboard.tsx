import React, { ReactElement } from "react";
import { Routes } from "universal-router";
import {
  Link,
  RouterResult,
  useLocation,
  useRouter,
} from "../../helpers/router";
import Footer from "../Footer";
import SideMenu from "../menu/SideMenu";

export const exactMatch = (ref: string, test: string): boolean => ref === test;
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
    <div className="container">
      <section
        className="dashboard"
        data-h2-flex-grid="b(stretch, contained, flush, none)"
      >
        <div
          data-h2-bg-color="b(lightnavy)"
          data-h2-flex-item="b(1of1) m(1of4) l(1of6)"
        >
          <div data-h2-padding="b(right-left, m)">
            <SideMenu items={menuItems} />
          </div>
        </div>
        <div data-h2-flex-item="b(1of1) m(8of12) l(10of12)">{content}</div>
      </section>
      <Footer />
    </div>
  );
};
