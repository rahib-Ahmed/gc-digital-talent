import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useClient } from "urql";
import isEqual from "lodash/isEqual";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { PoolCandidate } from "@gc-digital-talent/graphql";

import {
  PoolCandidateSearchInput,
  InputMaybe,
  useGetPoolCandidatesPaginatedQuery,
  Pool,
  Maybe,
  PoolCandidateWithSkillCount,
  useGetSkillsQuery,
  PublishingGroup,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import UserProfilePrintButton from "~/pages/Users/AdminUserProfilePage/components/UserProfilePrintButton";
import useSelectedRows from "~/hooks/useSelectedRows";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { getFullNameHtml, getFullNameLabel } from "~/utils/nameUtils";

import skillMatchDialogAccessor from "./SkillMatchDialog";
import tableMessages from "./tableMessages";
import { SearchState, SelectingFor } from "../Table/ResponsiveTable/types";
import {
  PoolCandidatesTable_SelectPoolCandidatesQuery,
  candidacyStatusAccessor,
  currentLocationAccessor,
  notesCell,
  priorityCell,
  statusCell,
  transformFormValuesToFilterState,
  transformPoolCandidateSearchInputToFormValues,
  transformSortStateToOrderByClause,
  viewPoolCandidateCell,
} from "./helpers";
import { rowSelectCell } from "../Table/ResponsiveTable/RowSelection";
import { normalizedText } from "../Table/sortingFns";
import accessors from "../Table/accessors";
import PoolCandidateFilterDialog from "./PoolCandidateFilterDialog";
import { FormValues } from "./types";
import {
  getPoolCandidateCsvData,
  getPoolCandidateCsvHeaders,
} from "./poolCandidateCsv";

const columnHelper = createColumnHelper<PoolCandidateWithSkillCount>();

const defaultState = {
  ...INITIAL_STATE,
  // hiddenColumnIds: ["candidacyStatus", "notes"],
  filters: {
    applicantFilter: {
      operationalRequirements: [],
      locationPreferences: [],
      equity: {},
      pools: [],
      skills: [],
      hasDiploma: undefined,
      languageAbility: undefined,
    },
    poolCandidateStatus: [],
    priorityWeight: [],
    publishingGroups: [PublishingGroup.ItJobs, PublishingGroup.ItJobsOngoing],
  },
};

const initialState = getTableStateFromSearchParams(defaultState);

const PoolCandidatesTable = ({
  initialFilterInput,
  currentPool,
  title,
  hidePoolFilter,
}: {
  initialFilterInput?: PoolCandidateSearchInput;
  currentPool?: Maybe<Pool>;
  title: string;
  hidePoolFilter?: boolean;
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const client = useClient();
  const [isSelecting, setIsSelecting] = React.useState<boolean>(false);
  const [selectingFor, setSelectingFor] = React.useState<SelectingFor>(null);
  const [selectedCandidates, setSelectedCandidates] = React.useState<
    PoolCandidate[]
  >([]);
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters: PoolCandidateSearchInput = React.useMemo(
    () => (filtersEncoded ? JSON.parse(filtersEncoded) : initialFilterInput),
    [filtersEncoded, initialFilterInput],
  );

  const filterRef = React.useRef<PoolCandidateSearchInput | undefined>(
    initialFilters,
  );
  const [paginationState, setPaginationState] = React.useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );

  const { selectedRows, setSelectedRows } = useSelectedRows<string>([]);

  const [searchState, setSearchState] = React.useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );

  const [sortState, setSortState] = React.useState<SortingState | undefined>(
    initialState.sortState ?? [{ id: "submitted_at", desc: true }],
  );

  const [filterState, setFilterState] = React.useState<
    PoolCandidateSearchInput | undefined
  >(initialFilters);

  const handlePaginationStateChange = ({
    pageIndex,
    pageSize,
  }: PaginationState) => {
    setPaginationState((previous) => ({
      pageIndex:
        previous.pageSize === pageSize
          ? pageIndex ?? INITIAL_STATE.paginationState.pageIndex
          : 0,
      pageSize: pageSize ?? INITIAL_STATE.paginationState.pageSize,
    }));
  };

  const handleSearchStateChange = ({ term, type }: SearchState) => {
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    setSearchState({
      term: term ?? INITIAL_STATE.searchState.term,
      type: type ?? INITIAL_STATE.searchState.type,
    });
  };

  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    const transformedData: PoolCandidateSearchInput =
      transformFormValuesToFilterState(data);

    setFilterState(transformedData);
    if (!isEqual(transformedData, filterRef.current)) {
      filterRef.current = transformedData;
    }
  };

  // merge search bar input with fancy filter state
  const addSearchToPoolCandidateFilterInput = (
    fancyFilterState: PoolCandidateSearchInput | undefined,
    searchBarTerm: string | undefined,
    searchType: string | undefined,
  ): InputMaybe<PoolCandidateSearchInput> | undefined => {
    if (
      fancyFilterState === undefined &&
      searchBarTerm === undefined &&
      searchType === undefined
    ) {
      return undefined;
    }
    return {
      // search bar
      generalSearch:
        searchBarTerm && !searchType ? searchBarTerm.split(",") : undefined,
      email: searchType === "email" ? searchBarTerm : undefined,
      name: searchType === "name" ? searchBarTerm : undefined,
      notes: searchType === "notes" ? searchBarTerm : undefined,

      // from fancy filter
      applicantFilter: {
        ...fancyFilterState?.applicantFilter,
        hasDiploma: null, // disconnect education selection for useGetPoolCandidatesPaginatedQuery
      },
      poolCandidateStatus: fancyFilterState?.poolCandidateStatus,
      priorityWeight: fancyFilterState?.priorityWeight,
      expiryStatus: fancyFilterState?.expiryStatus,
      suspendedStatus: fancyFilterState?.suspendedStatus,
      isGovEmployee: fancyFilterState?.isGovEmployee,
      publishingGroups: fancyFilterState?.publishingGroups,
    };
  };

  const [{ data, fetching }] = useGetPoolCandidatesPaginatedQuery({
    variables: {
      where: addSearchToPoolCandidateFilterInput(
        filterState,
        searchState?.term,
        searchState?.type,
      ),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      sortingInput: transformSortStateToOrderByClause(sortState, filterState),
    },
  });

  const filteredData: Array<PoolCandidateWithSkillCount> = React.useMemo(() => {
    const poolCandidates = data?.poolCandidatesPaginated.data ?? [];
    return poolCandidates.filter(notEmpty);
  }, [data?.poolCandidatesPaginated.data]);

  const [{ data: allSkillsData, fetching: fetchingSkills }] =
    useGetSkillsQuery();
  const allSkills = allSkillsData?.skills.filter(notEmpty);
  const filteredSkillIds = filterState?.applicantFilter?.skills
    ?.filter(notEmpty)
    .map((skill) => skill.id);

  const querySelected = async (action: SelectingFor) => {
    setSelectingFor(action);
    setIsSelecting(true);
    return client
      .query(PoolCandidatesTable_SelectPoolCandidatesQuery, {
        ids: selectedRows,
      })
      .toPromise()
      .then((result) => {
        const poolCandidates: PoolCandidate[] = unpackMaybes(
          result.data?.poolCandidates,
        );

        if (result.error) {
          toast.error(intl.formatMessage(errorMessages.unknown));
        } else if (!poolCandidates.length) {
          toast.error(intl.formatMessage(adminMessages.noRowsSelected));
        }

        setSelectedCandidates(poolCandidates);
        setIsSelecting(false);
        setSelectingFor(null);
        return poolCandidates;
      })
      .catch(() => {
        toast.error(intl.formatMessage(errorMessages.unknown));
      });
  };

  const columns = [
    columnHelper.accessor(
      ({ poolCandidate: { status } }) =>
        intl.formatMessage(
          status ? getPoolCandidateStatus(status) : commonMessages.notFound,
        ),
      {
        id: "status",
        header: intl.formatMessage(tableMessages.status),
        cell: ({
          row: {
            original: { poolCandidate },
          },
        }) => statusCell(poolCandidate.status, intl),
        meta: {
          sortingLocked: true,
        },
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        intl.formatMessage(
          user.priorityWeight
            ? getPoolCandidatePriorities(user.priorityWeight)
            : commonMessages.notFound,
        ),
      {
        id: "priority",
        header: intl.formatMessage(tableMessages.category),
        cell: ({
          row: {
            original: {
              poolCandidate: { user },
            },
          },
        }) => priorityCell(user.priorityWeight, intl),
        meta: {
          sortingLocked: true,
        },
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate }) =>
        candidacyStatusAccessor(poolCandidate.suspendedAt, intl),
      {
        id: "candidacyStatus",
        header: intl.formatMessage(tableMessages.candidacyStatus),
      },
    ),
    columnHelper.display({
      id: "view",
      header: intl.formatMessage(tableMessages.view),
      cell: ({
        row: {
          original: { poolCandidate },
        },
      }) => viewPoolCandidateCell(poolCandidate, paths, intl),
    }),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "candidateName",
        header: intl.formatMessage(tableMessages.candidateName),
        sortingFn: normalizedText,
        cell: ({
          row: {
            original: {
              poolCandidate: { user },
            },
          },
        }) => getFullNameHtml(user.firstName, user.lastName, intl),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(({ poolCandidate: { notes } }) => notes, {
      id: "notes",
      header: intl.formatMessage(adminMessages.notes),
      sortingFn: normalizedText,
      cell: ({
        row: {
          original: { poolCandidate },
        },
      }) => notesCell(poolCandidate, intl),
    }),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        intl.formatMessage(
          user.preferredLang
            ? getLanguage(user.preferredLang)
            : commonMessages.notFound,
        ),
      {
        id: "preferredLang",
        header: intl.formatMessage(tableMessages.preferredLang),
      },
    ),
    columnHelper.display({
      id: "skillCount",
      header: intl.formatMessage(tableMessages.skillCount),
      cell: ({
        row: {
          original: {
            poolCandidate: { user },
            skillCount,
          },
        },
      }) =>
        skillMatchDialogAccessor(
          allSkills?.filter((skill) => filteredSkillIds?.includes(skill.id)) ??
            [],
          skillCount,
          user.id,
          `${user.firstName} ${user.lastName}`,
        ),
    }),
    columnHelper.accessor(({ poolCandidate: { user } }) => user.email, {
      id: "email",
      header: intl.formatMessage(tableMessages.email),
      sortingFn: normalizedText,
      cell: ({
        row: {
          original: {
            poolCandidate: { user },
          },
        },
      }) => cells.email(user.email),
    }),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        currentLocationAccessor(user.currentCity, user.currentProvince, intl),
      {
        id: "currentLocation",
        header: intl.formatMessage(tableMessages.currentLocation),
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate: { submittedAt } }) => accessors.date(submittedAt),
      {
        id: "dateReceived",
        enableColumnFilter: false,
        header: intl.formatMessage(tableMessages.dateReceived),
        sortingFn: "datetime",
        cell: ({
          row: {
            original: {
              poolCandidate: { submittedAt },
            },
          },
        }) => cells.date(submittedAt, intl),
      },
    ),
  ] as ColumnDef<PoolCandidateWithSkillCount>[];

  return (
    <Table<PoolCandidateWithSkillCount>
      caption={title}
      data={filteredData}
      columns={columns}
      isLoading={fetching || fetchingSkills}
      hiddenColumnIds={["candidacyStatus", "notes"]}
      search={{
        internal: false,
        label: intl.formatMessage({
          defaultMessage: "Search by keyword",
          id: "lNU7FS",
          description: "Label for the pool candidates table search input",
        }),
        onChange: (newState: SearchState) => {
          handleSearchStateChange(newState);
        },
      }}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: defaultState.sortState,
      }}
      filter={{
        initialState: initialFilterInput,
        state: filterRef.current,
        component: (
          <PoolCandidateFilterDialog
            {...{ hidePoolFilter }}
            onSubmit={handleFilterSubmit}
            resetValues={transformPoolCandidateSearchInputToFormValues(
              initialFilterInput,
            )}
            initialValues={transformPoolCandidateSearchInputToFormValues(
              initialFilters,
            )}
          />
        ),
      }}
      rowSelect={{
        onRowSelection: setSelectedRows,
        getRowId: (row) => row.id,
        cell: ({ row }) =>
          rowSelectCell({
            row,
            label: getFullNameLabel(
              row.original.poolCandidate.user.firstName,
              row.original.poolCandidate.user.lastName,
              intl,
            ),
          }),
      }}
      download={{
        disableBtn: isSelecting,
        fetching: isSelecting && selectingFor === "download",
        selection: {
          csv: {
            headers: getPoolCandidateCsvHeaders(intl, currentPool),
            data: async () => {
              const selected = await querySelected("download");
              return getPoolCandidateCsvData(selected ?? [], intl);
            },
            fileName: intl.formatMessage(
              {
                defaultMessage: "pool_candidates_{date}.csv",
                id: "aWsXoR",
                description: "Filename for pool candidate CSV file download",
              },
              {
                date: new Date().toISOString(),
              },
            ),
          },
        },
      }}
      print={{
        component: (
          <UserProfilePrintButton
            users={selectedCandidates}
            beforePrint={async () => {
              await querySelected("print");
            }}
            disabled={isSelecting}
            fetching={isSelecting && selectingFor === "print"}
            color="whiteFixed"
            mode="inline"
            fontSize="caption"
          />
        ),
      }}
      pagination={{
        internal: false,
        total: data?.poolCandidatesPaginated?.paginatorInfo.total,
        pageSizes: [10, 20, 50, 100, 500],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
    />
  );
};

export default PoolCandidatesTable;
