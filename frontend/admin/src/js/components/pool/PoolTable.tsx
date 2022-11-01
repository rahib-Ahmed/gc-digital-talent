import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Link, Pill } from "@common/components";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { getLocale } from "@common/helpers/localize";
import { FromArray } from "@common/types/utilityTypes";
import Pending from "@common/components/Pending";
import {
  getAdvertisementStatus,
  getPoolStream,
} from "@common/constants/localizedConstants";
import { commonMessages } from "@common/messages";
import {
  GetPoolsQuery,
  Maybe,
  PoolStream,
  useGetPoolsQuery,
} from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<FromArray<GetPoolsQuery["pools"]>>;
type AccessorClassifications = Data["classifications"];

// callbacks extracted to separate function to stabilize memoized component
function poolCandidatesLinkAccessor(
  poolCandidatesTableUrl: string,
  intl: IntlShape,
  label?: Maybe<string>,
) {
  return (
    <Link
      href={poolCandidatesTableUrl}
      type="button"
      mode="inline"
      color="black"
      data-h2-padding="base(0)"
    >
      {intl.formatMessage(
        {
          defaultMessage: "View Candidates<hidden> for {label}</hidden>",
          id: "6R9N+h",
          description: "Text for a link to the Pool Candidates table",
        },
        { label },
      )}
    </Link>
  );
}

function viewLinkAccessor(
  editUrlRoot: string,
  id: string,
  title: Maybe<string>,
  classifications: AccessorClassifications,
  stream: PoolStream | null,
  intl: IntlShape,
) {
  let classificationString = ""; // type wrangling the complex type into a string
  if (classifications && classifications[0]) {
    const grouping = classifications[0];
    classificationString = `${grouping.group}-0${grouping.level}`;
  }

  return (
    <Link href={`${editUrlRoot}/${id}`} type="link">
      {`${title ? `${title} ` : ""}(${classificationString}${
        stream ? ` ${intl.formatMessage(getPoolStream(stream))}` : ""
      })`}
    </Link>
  );
}

export const PoolTable: React.FC<GetPoolsQuery & { editUrlRoot: string }> = ({
  pools,
  editUrlRoot,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Id",
          id: "kt5dPm",
          description:
            "Title displayed on the Pool table Unique Identifier column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Candidates",
          id: "EdUZaX",
          description:
            "Header for the View Candidates column of the Pools table",
        }),
        accessor: (pool) =>
          poolCandidatesLinkAccessor(
            paths.poolCandidateTable(pool.id),
            intl,
            pool.name ? pool.name[locale] : "",
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Pool Name",
          id: "HocLRh",
          description: "Title displayed for the Pool table pool name column.",
        }),
        accessor: (d) =>
          viewLinkAccessor(
            editUrlRoot,
            d.id,
            d.name ? d.name[locale] : "",
            d.classifications,
            d.stream ? d.stream : null,
            intl,
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Owner",
          id: "VgbJiw",
          description: "Title displayed for the Pool table owner email column.",
        }),
        accessor: ({ owner }) => owner?.email,
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Group and Level",
          id: "FGUGtr",
          description:
            "Title displayed for the Pool table Group and Level column.",
        }),
        accessor: ({ classifications }) =>
          classifications?.map((classification) => {
            return (
              <Pill
                key={`${classification?.group}-${classification?.level}`}
                color="primary"
                mode="outline"
              >
                {`${classification?.group}-${classification?.level}`}
              </Pill>
            );
          }),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Status",
          id: "ioqFVF",
          description: "Title displayed for the Pool table status column.",
        }),
        accessor: ({ advertisementStatus }) =>
          intl.formatMessage(
            advertisementStatus
              ? getAdvertisementStatus(advertisementStatus)
              : commonMessages.notFound,
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "tpzt/B",
          description: "Title displayed for the Pool table Edit column.",
        }),
        accessor: (d) =>
          tableEditButtonAccessor(
            d.id,
            editUrlRoot,
            d.name ? d.name[locale] : "",
          ), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, paths, locale],
  );

  const data = useMemo(() => pools.filter(notEmpty), [pools]);

  return (
    <Table
      data={data}
      columns={columns}
      hiddenCols={["id", "description"]}
      search={false}
      addBtn={{
        path: paths.poolCreate(),
        label: intl.formatMessage({
          defaultMessage: "Create Pool",
          id: "/Y7x+s",
          description: "Heading displayed above the Create Pool form.",
        }),
      }}
    />
  );
};

export const PoolTableApi: React.FunctionComponent = () => {
  const [result] = useGetPoolsQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  return (
    <Pending fetching={fetching} error={error}>
      <PoolTable pools={data?.pools ?? []} editUrlRoot={pathname} />
    </Pending>
  );
};
