import React from "react";
import { useIntl } from "react-intl";

import { navigationMessages } from "@gc-digital-talent/i18n";

export interface SkipLinkProps {
  href?: string;
}

const SkipLink = ({ href = "#main" }: SkipLinkProps) => {
  const intl = useIntl();

  return (
    // NOTE: Skip to is a custom link,we do not want to use the Link component
    // eslint-disable-next-line react/forbid-elements
    <a
      href={href}
      data-h2-visually-hidden="base(invisible) base:focus-visible(visible)"
      data-h2-background-color="base:focus-visible(white)"
      data-h2-border="base:focus-visible(medium, dashed, black)"
      data-h2-display="base:focus-visible(inline-block)"
      data-h2-location="base:focus-visible(0, auto, auto, x1)"
      data-h2-padding="base:focus-visible(x.25, x.5)"
      data-h2-position="base:focus-visible(fixed!important)"
      data-h2-width="base:focus-visible(auto)"
      data-h2-z-index="base:focus-visible(9999)"
    >
      {intl.formatMessage(navigationMessages.skipLink)}
    </a>
  );
};

export default SkipLink;
