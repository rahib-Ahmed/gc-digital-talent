import React from "react";
import { useIntl } from "react-intl";
import { useParams, Outlet } from "react-router-dom";
import {
  ClipboardDocumentIcon,
  Cog8ToothIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import Pending from "@common/components/Pending";
import SEO from "@common/components/SEO/SEO";
import { ThrowNotFound } from "@common/components/NotFound";
import { getFullPoolAdvertisementTitleLabel } from "@common/helpers/poolUtils";

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import { Pool, useGetBasicPoolInfoQuery } from "~/api/generated";
import { PageNavInfo } from "~/types/pages";

type PageNavKeys = "view" | "edit" | "candidates";

interface PoolHeaderProps {
  pool: Pick<Pool, "id" | "classifications" | "stream" | "name">;
}

const PoolHeader = ({ pool }: PoolHeaderProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pages = new Map<PageNavKeys, PageNavInfo>([
    [
      "view",
      {
        icon: ClipboardDocumentIcon,
        title: intl.formatMessage({
          defaultMessage: "Pool information",
          id: "Cjp2F6",
          description: "Title for the pool info page",
        }),
        link: {
          url: paths.poolView(pool.id),
        },
      },
    ],
    [
      "edit",
      {
        icon: Cog8ToothIcon,
        title: intl.formatMessage({
          defaultMessage: "Edit pool",
          id: "l7Wu86",
          description: "Title for the edit pool page",
        }),
        link: {
          url: paths.poolUpdate(pool.id),
        },
      },
    ],
    [
      "candidates",
      {
        icon: UserGroupIcon,
        title: intl.formatMessage({
          defaultMessage: "Candidates",
          id: "X4TOhW",
          description: "Page title for the admin pool candidates index page",
        }),
        link: {
          url: paths.poolCandidateTable(pool.id),
          label: intl.formatMessage({
            defaultMessage: "View Candidates",
            id: "Rl+0Er",
            description: "Title for the edit pool page",
          }),
        },
      },
    ],
  ]);

  const poolTitle = getFullPoolAdvertisementTitleLabel(intl, pool);
  const currentPage = useCurrentPage<PageNavKeys>(pages);

  return (
    <>
      <SEO title={currentPage?.title} />
      <PageHeader
        subtitle={poolTitle}
        icon={currentPage?.icon}
        navItems={pages}
      >
        {currentPage?.title}
      </PageHeader>
    </>
  );
};

const PoolLayout = () => {
  const { poolId } = useParams();
  const [{ data, fetching, error }] = useGetBasicPoolInfoQuery({
    variables: {
      poolId: poolId || "",
    },
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.pool ? <PoolHeader pool={data.pool} /> : <ThrowNotFound />}
      </Pending>
      <Outlet />
    </>
  );
};

export default PoolLayout;
