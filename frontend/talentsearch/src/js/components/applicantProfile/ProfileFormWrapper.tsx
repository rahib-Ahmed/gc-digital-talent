import * as React from "react";
import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { UserIcon } from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { imageUrl } from "@common/helpers/router";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import CancelButton from "./CancelButton";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

export interface ProfileFormWrapperProps {
  crumbs: BreadcrumbsProps["links"];
  description: string;
  title: string;
  cancelLink?: string;
}

const ProfileFormWrapper: React.FunctionComponent<ProfileFormWrapperProps> = ({
  crumbs,
  description,
  title,
  children,
  cancelLink,
}) => {
  const intl = useIntl();
  const profilePath = useApplicantProfileRoutes();
  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "My Profile",
        description: "Breadcrumb from applicant profile wrapper.",
      }),
      href: profilePath.home(),
      icon: <UserIcon style={{ width: "1rem", marginRight: "5px" }} />,
    },
    ...crumbs,
  ];

  const breadcrumbs = (
    <div
      data-h2-padding="base(x1, x.5) p-tablet(x1, x4)"
      data-h2-color="base(dt-white)"
      style={{
        background: `url(${imageUrl(
          TALENTSEARCH_APP_DIR,
          "applicant-profile-banner.png",
        )})`,
        backgroundSize: "100vw 5rem",
      }}
    >
      <Breadcrumbs links={links} />
    </div>
  );

  return (
    <section>
      {breadcrumbs}
      <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
        <div data-h2-margin="base(x2, 0, 0, -x1)">
          <CancelButton link={cancelLink} />
        </div>
        <h1
          data-h2-margin="base(x2, 0, x1, 0)"
          data-h2-font-size="base(h2, 1.3)"
          data-h2-font-weight="base(200)"
        >
          {title}
        </h1>
        <p>{description}</p>
        <div>{children}</div>
      </div>
      {breadcrumbs}
    </section>
  );
};

export default ProfileFormWrapper;
