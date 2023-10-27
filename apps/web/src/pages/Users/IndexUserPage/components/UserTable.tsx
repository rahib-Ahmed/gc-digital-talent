import React, { useEffect, useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";

import { notEmpty, uniqueItems } from "@gc-digital-talent/helpers";
import { getLanguage, getLocalizedName } from "@gc-digital-talent/i18n";
import { Link, Pending } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { toast } from "@gc-digital-talent/toast";
import { unpackMaybes } from "@gc-digital-talent/forms";

import { getFullNameHtml, getFullNameLabel } from "~/utils/nameUtils";
import { FromArray } from "~/types/utility";
import useRoutes from "~/hooks/useRoutes";
import {
  InputMaybe,
  Language,
  PositionDuration,
  useAllUsersPaginatedQuery,
  User,
  UserFilterInput,
  UserPaginator,
  useSelectedUsersQuery,
  RoleAssignment,
  Trashed,
} from "~/api/generated";
import TableHeader from "~/components/Table/ApiManagedTable/TableHeader";
import TableFooter from "~/components/Table/ApiManagedTable/TableFooter";
import BasicTable from "~/components/Table/ApiManagedTable/BasicTable";
import useTableState from "~/hooks/useTableState";
import {
  ColumnsOf,
  SortingRule,
  sortingRuleToOrderByClause,
  handleColumnHiddenChange,
  rowSelectionColumn,
  handleRowSelectedChange,
  TABLE_DEFAULTS,
} from "~/components/Table/ApiManagedTable/helpers";
import cells from "~/components/Table/cells";
import {
  durationToEnumPositionDuration,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
} from "~/utils/userUtils";
import adminMessages from "~/messages/adminMessages";
import useSelectedRows from "~/hooks/useSelectedRows";

import useUserCsvData from "../hooks/useUserCsvData";
import UserTableFilterDialog, {
  FormValues,
} from "./UserTableFilterDialog/UserTableFilterDialog";
import UserProfilePrintButton from "../../AdminUserProfilePage/components/UserProfilePrintButton";

type Data = NonNullable<FromArray<UserPaginator["data"]>>;

function transformFormValuesToUserFilterInput(
  data: FormValues,
): UserFilterInput {
  return {
    applicantFilter: {
      languageAbility: data.languageAbility[0]
        ? stringToEnumLanguage(data.languageAbility[0])
        : undefined,
      locationPreferences: data.workRegion.map((region) => {
        return stringToEnumLocation(region);
      }),
      operationalRequirements: data.operationalRequirement.map(
        (requirement) => {
          return stringToEnumOperational(requirement);
        },
      ),
      skills: data.skills.map((skill) => {
        const skillString = skill;
        return { id: skillString };
      }),
      positionDuration:
        data.employmentDuration[0] === "TERM" // either filter for TEMPORARY or do nothing
          ? [durationToEnumPositionDuration(data.employmentDuration[0])]
          : undefined,
    },
    isGovEmployee: data.govEmployee[0] ? true : undefined,
    isProfileComplete: data.profileComplete[0] ? true : undefined,
    poolFilters: data.pools.map((pool) => {
      const poolString = pool;
      return { poolId: poolString };
    }),
    roles: data.roles,
    trashed: data.trashed[0] ? Trashed.Only : undefined,
  };
}

function transformUserFilterInputToFormValues(
  input: UserFilterInput | undefined,
): FormValues {
  return {
    languageAbility: input?.applicantFilter?.languageAbility
      ? [input?.applicantFilter?.languageAbility]
      : [],
    workRegion:
      input?.applicantFilter?.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirement:
      input?.applicantFilter?.operationalRequirements?.filter(notEmpty) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    employmentDuration:
      input?.applicantFilter?.positionDuration &&
      input.applicantFilter.positionDuration.includes(
        PositionDuration.Temporary,
      )
        ? ["TERM"]
        : [],
    govEmployee: input?.isGovEmployee ? ["true"] : [],
    profileComplete: input?.isProfileComplete ? ["true"] : [],
    pools:
      input?.poolFilters
        ?.filter(notEmpty)
        .map((poolFilter) => poolFilter.poolId) ?? [],
    roles: input?.roles?.filter(notEmpty) ?? [],
    trashed: input?.trashed ? ["true"] : [],
  };
}

// callbacks extracted to separate function to stabilize memoized component
const languageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {language ? intl.formatMessage(getLanguage(language as string)) : ""}
  </span>
);

const rolesAccessor = (
  roleAssignments: RoleAssignment[] | null | undefined,
  intl: IntlShape,
) => {
  if (roleAssignments && roleAssignments.length > 0) {
    const roles = roleAssignments.map((roleAssignment) => roleAssignment.role);
    const rolesFiltered = roles.filter(notEmpty);
    // custom selection of roles of note for table viewing, most likely kept in sync with options in the filter dialog
    const rolesToDisplay = rolesFiltered
      .filter(
        (role) =>
          role.name === ROLE_NAME.PlatformAdmin ||
          role.name === ROLE_NAME.PoolOperator ||
          role.name === ROLE_NAME.RequestResponder,
      )
      .map((role) => getLocalizedName(role.displayName, intl));
    const uniqueRolesToDisplay = uniqueItems(rolesToDisplay);

    return cells.commaList({
      list: uniqueRolesToDisplay,
    });
  }

  return null;
};

export const phoneAccessor = (telephone: string | null | undefined) => {
  if (telephone) {
    return (
      <Link
        external
        color="black"
        href={`tel:${telephone}`}
        aria-label={telephone.replace(/.{1}/g, "$& ")}
      >
        {telephone}
      </Link>
    );
  }
  return "";
};

const emailLinkAccessor = (email: string | null, intl: IntlShape) => {
  if (email) {
    return (
      <Link
        external
        color="black"
        href={`mailto:${email}`}
        title={intl.formatMessage({
          defaultMessage: "Link to user email",
          id: "/8fQ9Y",
          description: "Descriptive title for an anchor link",
        })}
      >
        {email}
      </Link>
    );
  }
  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
};

const defaultState = {
  ...TABLE_DEFAULTS,
  hiddenColumnIds: [
    "telephone",
    "preferredLanguage",
    "createdDate",
    "updatedDate",
    "rolesAndPermissions",
  ],
  sortBy: {
    column: {
      id: "createdDate",
      sortColumnName: "created_at",
    },
    desc: false,
  },
  // Note: lodash/isEqual is comparing undefined
  // so we need to actually set it here
  filters: {
    applicantFilter: {
      languageAbility: undefined,
      locationPreferences: [],
      operationalRequirements: [],
      positionDuration: undefined,
      skills: [],
    },
    isGovEmployee: undefined,
    isProfileComplete: undefined,
    poolFilters: [],
  },
};

const UserTable = ({ title }: { title: string }) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { pathname } = useLocation();
  const [tableState, setTableState] = useTableState<Data, UserFilterInput>(
    defaultState,
  );
  const {
    pageSize,
    currentPage,
    sortBy: sortingRule,
    hiddenColumnIds,
    searchState,
    filters: userFilterInput,
  } = tableState;

  const { selectedRows, setSelectedRows, hasSelected } = useSelectedRows<User>(
    [],
  );

  // merge search bar input with fancy filter state
  const addSearchToUserFilterInput = (
    fancyFilterState: UserFilterInput | undefined,
    searchBarTerm: string | undefined,
    searchType: string | undefined,
  ): InputMaybe<UserFilterInput> => {
    if (
      fancyFilterState === undefined &&
      searchBarTerm === undefined &&
      searchType === undefined
    ) {
      return undefined;
    }

    return {
      // search bar
      generalSearch: searchBarTerm && !searchType ? searchBarTerm : undefined,
      email: searchType === "email" ? searchBarTerm : undefined,
      name: searchType === "name" ? searchBarTerm : undefined,
      telephone: searchType === "phone" ? searchBarTerm : undefined,

      // from fancy filter
      applicantFilter: fancyFilterState?.applicantFilter,
      isGovEmployee: fancyFilterState?.isGovEmployee,
      isProfileComplete: fancyFilterState?.isProfileComplete,
      poolFilters: fancyFilterState?.poolFilters,
      roles: fancyFilterState?.roles,
      trashed: fancyFilterState?.trashed,
    };
  };

  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    const transformedData = transformFormValuesToUserFilterInput(data);
    // this state lives in the UserTable component, this step also acts like a formValuesToSubmitData function
    setTableState({
      filters: transformedData,
      currentPage: defaultState.currentPage,
    });
  };

  useEffect(() => {
    setSelectedRows([]);
  }, [currentPage, pageSize, searchState, setSelectedRows, sortingRule]);

  const [result] = useAllUsersPaginatedQuery({
    variables: {
      where: addSearchToUserFilterInput(
        userFilterInput,
        searchState?.term,
        searchState?.type,
      ),
      page: currentPage,
      first: pageSize,
      orderBy: sortingRuleToOrderByClause(sortingRule),
    },
  });

  const { data, fetching, error } = result;

  const filteredData: Array<Data> = useMemo(() => {
    const users = data?.usersPaginated?.data ?? [];
    return users.filter(notEmpty);
  }, [data?.usersPaginated?.data]);

  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      rowSelectionColumn(
        intl,
        selectedRows,
        filteredData.length,
        (user: Data) => `${user.firstName} ${user.lastName}`,
        (event) =>
          handleRowSelectedChange(
            filteredData,
            selectedRows,
            setSelectedRows,
            event,
          ),
      ),
      {
        label: intl.formatMessage({
          defaultMessage: "Candidate Name",
          id: "NeNnAP",
          description:
            "Title displayed on the User table Candidate Name column.",
        }),
        accessor: (user) =>
          getFullNameHtml(user.firstName, user.lastName, intl),
        id: "candidateName",
        sortColumnName: "first_name",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          id: "0+g2jN",
          description: "Title displayed for the User table Email column.",
        }),
        accessor: (user) =>
          emailLinkAccessor(user.email ? user.email : "", intl),
        id: "email",
        sortColumnName: "email",
      },
      {
        label: intl.formatMessage(adminMessages.rolesAndPermissions),
        accessor: (user) =>
          rolesAccessor(
            unpackMaybes(user.authInfo?.roleAssignments) ?? [],
            intl,
          ),
        id: "rolesAndPermissions",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Telephone",
          id: "fXMsoK",
          description: "Title displayed for the User table Telephone column.",
        }),
        accessor: (user) => phoneAccessor(user.telephone),
        id: "telephone",
        sortColumnName: "telephone",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Preferred Communication Language",
          id: "CfXIqC",
          description:
            "Title displayed for the User table Preferred Communication Language column.",
        }),
        accessor: (user) => languageAccessor(user.preferredLang, intl),
        id: "preferredLanguage",
        sortColumnName: "preferred_lang",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Edit",
          id: "qYH0du",
          description: "Title displayed for the User table Edit column.",
        }),
        accessor: (d) =>
          cells.edit(
            d.id,
            pathname,
            getFullNameLabel(d.firstName, d.lastName, intl),
          ), // callback extracted to separate function to stabilize memoized component
        id: "edit",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "View",
          id: "hci1jW",
          description: "Title displayed for the User table View column.",
        }),
        accessor: (user) =>
          cells.view(
            paths.userView(user.id),
            "",
            getFullNameLabel(user.firstName, user.lastName, intl),
          ),
        id: "view",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Created",
          id: "+pgXHm",
          description: "Title displayed for the User table Date Created column",
        }),
        accessor: (user) =>
          user.createdDate
            ? formatDate({
                date: parseDateTimeUtc(user.createdDate),
                formatString: "PPP p",
                intl,
              })
            : null,
        id: "createdDate",
        sortColumnName: "created_at",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Updated",
          id: "R2sSy9",
          description: "Title displayed for the User table Date Updated column",
        }),
        accessor: (user) =>
          user.updatedDate
            ? formatDate({
                date: parseDateTimeUtc(user.updatedDate),
                formatString: "PPP p",
                intl,
              })
            : null,
        id: "updatedDate",
        sortColumnName: "updated_at",
      },
    ],
    [intl, selectedRows, setSelectedRows, filteredData, paths, pathname],
  );

  const allColumnIds = columns.map((c) => c.id);

  const selectedApplicantIds = selectedRows.map((user) => user.id);
  const [
    {
      data: selectedUsersData,
      fetching: selectedUsersFetching,
      error: selectedUsersError,
    },
  ] = useSelectedUsersQuery({
    variables: {
      ids: selectedApplicantIds,
    },
    pause: !hasSelected,
  });

  const selectedApplicants =
    selectedUsersData?.applicants.filter(notEmpty) ?? [];

  const csv = useUserCsvData(selectedApplicants);

  const initialFilters = useMemo(
    () => transformUserFilterInputToFormValues(userFilterInput),
    [userFilterInput],
  );

  const handlePageSizeChange = (newPageSize: number) => {
    setTableState({ pageSize: newPageSize });
  };

  const handleCurrentPageChange = (newCurrentPage: number) => {
    setTableState({
      currentPage: newCurrentPage,
    });
  };

  const handleSortingRuleChange = (
    newSortingRule: SortingRule<Date> | undefined,
  ) => {
    setTableState({
      sortBy: newSortingRule,
    });
  };

  const handleSearchStateChange = ({
    term,
    type,
  }: {
    term: string | undefined;
    type: string | undefined;
  }) => {
    setTableState({
      currentPage: 1,
      searchState: {
        term: term ?? defaultState.searchState.term,
        type: type ?? defaultState.searchState.type,
      },
    });
  };

  const setHiddenColumnIds = (newCols: string[]) => {
    setTableState({
      hiddenColumnIds: newCols,
    });
  };

  const handlePrint = (onPrint: () => void) => {
    if (
      selectedUsersFetching ||
      !!selectedUsersError ||
      !selectedUsersData?.applicants.length
    ) {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Download failed: No rows selected",
          id: "k4xm25",
          description:
            "Alert message displayed when a user attempts to print without selecting items first",
        }),
      );
    } else if (onPrint) {
      onPrint();
    }
  };

  return (
    <div data-h2-margin="base(x1, 0)">
      <h2 id="user-table-heading" data-h2-visually-hidden="base(invisible)">
        {intl.formatMessage({
          defaultMessage: "All Users",
          id: "VlI1K4",
          description: "Title for the admin users table",
        })}
      </h2>
      <TableHeader
        onSearchChange={(
          term: string | undefined,
          type: string | undefined,
        ) => {
          handleSearchStateChange({
            term,
            type,
          });
        }}
        initialSearchState={searchState}
        columns={columns}
        searchBy={[
          {
            label: intl.formatMessage({
              defaultMessage: "Name",
              id: "36k+Da",
              description: "Label for user table search dropdown (name).",
            }),
            value: "name",
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Email",
              id: "fivWMs",
              description: "Label for user table search dropdown (email).",
            }),
            value: "email",
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Phone",
              id: "CjkBMT",
              description: "Label for user table search dropdown (phone).",
            }),
            value: "phone",
          },
        ]}
        onColumnHiddenChange={(event) => {
          handleColumnHiddenChange(
            allColumnIds,
            hiddenColumnIds ?? [],
            setHiddenColumnIds,
            event,
          );
        }}
        hiddenColumnIds={hiddenColumnIds ?? []}
        filterComponent={
          <UserTableFilterDialog
            onSubmit={handleFilterSubmit}
            initialFilters={initialFilters}
          />
        }
        title={title}
      />
      <div data-h2-radius="base(s)">
        <Pending fetching={fetching} error={error} inline>
          <BasicTable
            labelledBy="user-table-heading"
            title={title}
            data={filteredData}
            columns={columns}
            onSortingRuleChange={handleSortingRuleChange}
            sortingRule={sortingRule}
            hiddenColumnIds={hiddenColumnIds ?? []}
          />
        </Pending>
        <TableFooter
          paginatorInfo={data?.usersPaginated?.paginatorInfo}
          onCurrentPageChange={handleCurrentPageChange}
          onPageSizeChange={handlePageSizeChange}
          csv={{
            ...csv,
            fileName: intl.formatMessage(
              {
                defaultMessage: "users_{date}.csv",
                id: "mYuXWF",
                description: "Filename for user CSV file download",
              },
              {
                date: new Date().toISOString(),
              },
            ),
          }}
          additionalActions={
            <UserProfilePrintButton
              users={selectedApplicants}
              beforePrint={handlePrint}
              color="white"
              mode="inline"
            />
          }
          hasSelection
          fetchingSelected={selectedUsersFetching}
          selectionError={selectedUsersError}
          disableActions={
            selectedUsersFetching ||
            !!selectedUsersError ||
            !selectedUsersData?.applicants.length
          }
        />
      </div>
    </div>
  );
};

export default UserTable;
