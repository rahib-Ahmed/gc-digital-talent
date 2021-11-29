import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { useLocation } from "@common/helpers/router";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import {
  GetPoolCandidatesQuery,
  useGetPoolCandidatesByPoolQuery,
} from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import { tableBooleanAccessor } from "../TableBoolean";
import DashboardContentContainer from "../DashboardContentContainer";
import { tableEditButtonAccessor } from "../TableEditButton";

const messages = defineMessages({
  columnIdTitle: {
    defaultMessage: "ID",
    description: "Title displayed on the Pool Candidates table ID column.",
  },
  columnPoolTitle: {
    defaultMessage: "Pool",
    description: "Title displayed for the Pool Candidates table Pool column.",
  },
  columnUserTitle: {
    defaultMessage: "User",
    description: "Title displayed for the Pool Candidates table User column.",
  },
  columnExpiryTitle: {
    defaultMessage: "Expiry",
    description: "Title displayed for the Pool Candidates table Expiry column.",
  },
  columnWomanTitle: {
    defaultMessage: "Woman",
    description: "Title displayed for the Pool Candidates table Woman column.",
  },
  columnDisabilityTitle: {
    defaultMessage: "Disability",
    description:
      "Title displayed for the Pool Candidates table Disability column.",
  },
  columnIndigenousTitle: {
    defaultMessage: "Indigenous",
    description:
      "Title displayed for the Pool Candidates table Indigenous column.",
  },
  columnVisibleMinorityTitle: {
    defaultMessage: "Visible Minority",
    description:
      "Title displayed for the Pool Candidates table Visible Minority column.",
  },
  columnDiplomaTitle: {
    defaultMessage: "Diploma",
    description:
      "Title displayed for the Pool Candidates table Diploma column.",
  },
  columnLanguageTitle: {
    defaultMessage: "Language",
    description:
      "Title displayed for the Pool Candidates table Language column.",
  },
  nameTitle: {
    defaultMessage: "Name",
    description: "Title displayed on the Pool Candidates table name column.",
  },
  emailTitle: {
    defaultMessage: "Email",
    description: "Title displayed on the Pool Candidates table email column.",
  },
  telephoneTitle: {
    defaultMessage: "Telephone",
    description:
      "Title displayed on the Pool Candidates table telephone column.",
  },
  preferredLangTitle: {
    defaultMessage: "Preferred Lang",
    description:
      "Title displayed on the Pool Candidates table Preferred Lang column.",
  },
  columnEditTitle: {
    defaultMessage: "Edit",
    description: "Title displayed for the Pool Candidates table Edit column.",
  },
});

type Data = NonNullable<FromArray<GetPoolCandidatesQuery["poolCandidates"]>>;

const PoolCandidatesTable: React.FC<
  GetPoolCandidatesQuery & { editUrlRoot: string }
> = ({ poolCandidates, editUrlRoot }) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnIdTitle),
        accessor: "cmoIdentifier",
      },
      {
        Header: intl.formatMessage(messages.columnPoolTitle),
        accessor: (d) => d.pool?.name?.en,
      },
      {
        Header: intl.formatMessage(messages.columnUserTitle),
        accessor: (d) => d.user?.email,
      },
      {
        Header: intl.formatMessage(messages.columnExpiryTitle),
        accessor: "expiryDate",
      },
      {
        Header: intl.formatMessage(messages.columnWomanTitle),
        accessor: (d) => tableBooleanAccessor(d.isWoman), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage(messages.columnDisabilityTitle),
        accessor: (d) => tableBooleanAccessor(d.hasDisability), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage(messages.columnIndigenousTitle),
        accessor: (d) => tableBooleanAccessor(d.isIndigenous), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage(messages.columnVisibleMinorityTitle),
        accessor: (d) => tableBooleanAccessor(d.isVisibleMinority), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage(messages.columnDiplomaTitle),
        accessor: (d) => tableBooleanAccessor(d.hasDiploma), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage(messages.columnLanguageTitle),
        accessor: "languageAbility",
      },
      {
        Header: intl.formatMessage(messages.nameTitle),
        accessor: ({ user }) => `${user?.firstName} ${user?.lastName}`,
      },
      {
        Header: intl.formatMessage(messages.telephoneTitle),
        accessor: ({ user }) => user?.telephone,
      },
      {
        Header: intl.formatMessage(messages.preferredLangTitle),
        accessor: ({ user }) => user?.preferredLang,
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
        accessor: (d) => tableEditButtonAccessor(d.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [intl, editUrlRoot],
  );

  const memoizedData = useMemo(
    () => poolCandidates.filter(notEmpty),
    [poolCandidates],
  );

  return <Table data={memoizedData} columns={columns} />;
};

export default PoolCandidatesTable;

export const PoolCandidatesTableApi: React.FC<{ poolId: string }> = ({
  poolId,
}) => {
  const intl = useIntl();
  const [result] = useGetPoolCandidatesByPoolQuery({
    variables: { id: poolId },
  });
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)} {error.message}
        </p>
      </DashboardContentContainer>
    );

  return (
    <PoolCandidatesTable
      poolCandidates={data?.pool?.poolCandidates ?? []}
      editUrlRoot={pathname}
    />
  );
};
