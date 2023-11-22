import React from "react";
import { useIntl } from "react-intl";

import { Heading, Link } from "@gc-digital-talent/ui";

interface ReviewSectionProps {
  title: string;
  path: string;
  editLinkAriaLabel: string;
  children: React.ReactNode;
}

const ReviewSection = ({
  title,
  path,
  editLinkAriaLabel,
  children,
}: ReviewSectionProps) => {
  const intl = useIntl();
  return (
    <section data-h2-margin="base(x3, 0, 0, 0)">
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(space-between)"
        data-h2-align-items="base(center)"
      >
        <Heading
          level="h3"
          size="h4"
          data-h2-font-weight="base(700)"
          data-h2-margin="base(0)"
        >
          {title}
        </Heading>
        <Link mode="inline" href={path} aria-label={editLinkAriaLabel}>
          {intl.formatMessage({
            defaultMessage: "Edit this section",
            id: "Z8hEuY",
            description: "Default edit link text for application review page",
          })}
        </Link>
      </div>
      {children}
    </section>
  );
};

export default ReviewSection;
