import React from "react";
import { useIntl } from "react-intl";

import { Link, LinkProps } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { Scalars } from "~/api/generated";
import { useFeatureFlags } from "@gc-digital-talent/env";

interface ApplicationLinkProps {
  poolId: Scalars["ID"];
  applicationId?: Scalars["ID"];
  hasApplied?: boolean;
  canApply?: boolean;
  linkProps?: Omit<LinkProps, "mode" | "ref">;
}

const ApplicationLink = ({
  poolId,
  applicationId,
  hasApplied,
  canApply,
  linkProps,
}: ApplicationLinkProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  // Application does not exist and user cannot apply.
  // So, do not show anything
  if (!canApply && !applicationId) {
    return null;
  }

  const href = applicationId
    ? paths.application(applicationId)
    : paths.createApplication(poolId);

  let linkText = intl.formatMessage({
    defaultMessage: "Apply for this process",
    id: "W2YIEA",
    description: "Link text to apply for a pool advertisement",
  });
  if (applicationId) {
    linkText = hasApplied
      ? intl.formatMessage({
          defaultMessage: "View my application",
          id: "btCYxZ",
          description: "Link text to view an existing, submitted application",
        })
      : intl.formatMessage({
          defaultMessage: "Continue my application",
          id: "g5JeNf",
          description: "Link text to continue an existing, draft application",
        });
  }

  return (
    <Link mode="solid" href={href} {...linkProps}>
      {linkText}
    </Link>
  );
};

export default ApplicationLink;
