import React from "react";
import { useIntl } from "react-intl";

import CallToAction from "../CallToAction";
import { PugDark, PugLight } from "./Icons";

const Error404 = () => {
  const intl = useIntl();
  return (
    <>
      <div
        data-h2-background-color="base(tm-linear-divider)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
      />
      <div
        data-h2-background-color="base(white) base:dark(black.light)"
        data-h2-color="base(black) base:dark(white)"
        data-h2-padding="base(x3, 0)"
      >
        <div
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-text-align="base(center)"
        >
          <h1 data-h2-font-size="base(h4, 1.4)" data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage:
                "Sorry eh! We can't find the page you were looking for.",
              id: "85bL9g",
              description: "Title for the 404 page not found page.",
            })}
          </h1>
          <PugLight
            data-h2-display="base(inline-block) base:dark(none)"
            data-h2-width="base(70%)"
          />
          <PugDark
            data-h2-display="base(none) base:dark(inline-block)"
            data-h2-width="base(70%)"
          />
          <p data-h2-margin="base(x1, 0) p-tablet(0, 0, x3, 0)">
            {intl.formatMessage({
              defaultMessage:
                " It looks like you've landed on a page that either doesn't exist or has moved.",
              id: "WuVY2X",
              description: "Body text for the 404 page not found page.",
            })}
          </p>
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x1)"
            data-h2-justify-content="base(center)"
            data-h2-flex-wrap="base(wrap) p-tablet(initial)"
          >
            <CallToAction
              type="link"
              context="home"
              content={{
                path: "path/to/home",
                label: intl.formatMessage({
                  defaultMessage: "Go to the homepage",
                  id: "i9E0ka",
                  description: "Link text to go to the homepage from a 404",
                }),
              }}
            />
            <CallToAction
              type="link"
              context="support"
              content={{
                path: "path/to/support",
                label: intl.formatMessage({
                  defaultMessage: "Report a missing page",
                  id: "kfzKrV",
                  description:
                    "Link text to go report a missing page on the 404",
                }),
              }}
            />
          </div>
        </div>
      </div>
      <div
        data-h2-background-color="base(tm-linear-divider)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
      />
    </>
  );
};

export default Error404;
