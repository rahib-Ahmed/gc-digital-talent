import React from "react";
import { useIntl } from "react-intl";

import Link from "../Link";
import { GocLogo, GocLogoWhite } from "../Svg";

import {
  getLocale,
  localizePath,
  oppositeLocale,
} from "../../helpers/localize";
import { useLocation } from "../../helpers/router";

export interface HeaderProps {
  width?: string;
}

const Header = ({ width }: HeaderProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const location = useLocation();
  const changeToLang = oppositeLocale(locale);
  const languageTogglePath = localizePath(location, changeToLang);
  let headerWidth = {
    "data-h2-container": "base(center, large, x1) p-tablet(center, large, x2)",
  };
  if (width === "full") {
    headerWidth = {
      "data-h2-container": "base(center, full, x1) p-tablet(center, full, x2)",
    };
  }
  return (
    <header
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-border="base(bottom, 1px, solid, black.2) base:dark(bottom, 1px, solid, white.2)"
      data-h2-padding="base(x1, 0) p-tablet(x.5, 0)"
    >
      <div {...headerWidth}>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr)"
          data-h2-gap="base(x.5) p-tablet(x2)"
          data-h2-align-items="base(center)"
        >
          <div data-h2-text-align="base(center) p-tablet(left)">
            <a
              href={`https://www.canada.ca/${locale}.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GocLogo
                data-h2-max-width="base(x12) p-tablet(x15)"
                data-h2-display="base(block) base:dark(none)"
              />
              <GocLogoWhite
                data-h2-max-width="base(x12) p-tablet(x15)"
                data-h2-display="base(none) base:dark(block)"
              />
              <span data-h2-visibility="base(invisible)">
                {intl.formatMessage({
                  defaultMessage: "Canada.ca",
                  id: "gpcHeU",
                  description:
                    "Alt text for the Canada logo link in the Header.",
                })}
              </span>
            </a>
          </div>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x.5) p-tablet(x1)"
            data-h2-align-items="base(center)"
            data-h2-justify-content="base(center) p-tablet(flex-end)"
            data-h2-text-align="base(center) p-tablet(left)"
          >
            <div>{/* <ThemeSwitcher /> */}</div>
            <div>
              <Link
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
                href={languageTogglePath}
                lang={changeToLang === "en" ? "en" : "fr"}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "<hidden>Changer la langue en </hidden>Français",
                  id: "Z3h103",
                  description: "Title for the language toggle link.",
                })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
