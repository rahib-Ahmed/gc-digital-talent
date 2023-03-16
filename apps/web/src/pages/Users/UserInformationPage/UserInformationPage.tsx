import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import {
  CalculatorIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { Pending, TableOfContents, ThrowNotFound } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import { Scalars, useGetViewUserDataQuery } from "~/api/generated";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";

import AboutSection from "./components/AboutSection";
import { UserInformationProps } from "./types";
import CandidateStatusSection from "./components/CandidateStatusSection";
import NotesSection from "./components/NotesSection";
import EmploymentEquitySection from "./components/EmploymentEquitySection";

const UserInformation = ({ user, pools }: UserInformationProps) => {
  const intl = useIntl();

  const items = [
    {
      id: "about",
      title: intl.formatMessage({
        defaultMessage: "About",
        id: "uutH18",
        description: "Title of the 'About' section of the view-user page",
      }),
      titleIcon: UserIcon,
      content: <AboutSection user={user} />,
    },
    {
      id: "candidate-status",
      title: intl.formatMessage({
        defaultMessage: "Candidate status",
        id: "F00OD4",
        description:
          "Title of the 'Candidate status' section of the view-user page",
      }),
      titleIcon: CalculatorIcon,
      content: <CandidateStatusSection user={user} pools={pools} />,
    },
    {
      id: "notes",
      title: intl.formatMessage({
        defaultMessage: "Notes",
        id: "4AubyK",
        description: "Title of the 'Notes' section of the view-user page",
      }),
      titleIcon: PencilSquareIcon,
      content: <NotesSection user={user} />,
    },
    {
      id: "employment-equity",
      title: intl.formatMessage({
        defaultMessage: "Employment equity",
        id: "BYGKiT",
        description:
          "Title of the 'Employment equity' section of the view-user page",
      }),
      titleIcon: InformationCircleIcon,
      content: <EmploymentEquitySection user={user} />,
    },
  ];

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        {items.map((item) => (
          <TableOfContents.AnchorLink key={item.id} id={item.id}>
            {item.title}
          </TableOfContents.AnchorLink>
        ))}
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        {items.map((item) => (
          <TableOfContents.Section key={item.id} id={item.id}>
            <TableOfContents.Heading
              icon={item.titleIcon}
              as="h3"
              data-h2-margin="base(x3, 0, x1, 0)"
            >
              {item.title}
            </TableOfContents.Heading>
            {item.content}
          </TableOfContents.Section>
        ))}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

type RouteParams = {
  userId: Scalars["ID"];
};

const UserInformationPage = () => {
  const { userId } = useParams<RouteParams>();
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data: lookupData, fetching, error }] = useGetViewUserDataQuery({
    variables: { id: userId || "" },
  });

  const user = lookupData?.applicant;
  const pools = lookupData?.pools.filter(notEmpty);

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "DUK/pz",
        description: "Breadcrumb title for the home page link.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Users",
        id: "Y7eGtg",
        description: "Breadcrumb title for the users page link.",
      }),
      url: routes.userTable(),
    },
    ...(userId
      ? [
          {
            label: getFullNameLabel(user?.firstName, user?.lastName, intl),
            url: routes.userView(userId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Candidate details",
          id: "dj8GiH",
          description: "Page title for the individual user page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        {user && pools ? (
          <UserInformation user={user} pools={pools} />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default UserInformationPage;
