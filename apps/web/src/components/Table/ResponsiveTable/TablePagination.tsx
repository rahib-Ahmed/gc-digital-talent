import React from "react";
import { useIntl } from "react-intl";
import { Table } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";

import Pagination from "~/components/Pagination";

import { PaginationDef } from "./types";
import { SEARCH_PARAM_KEY } from "./constants";

interface TablePaginationProps<T> {
  pagination: PaginationDef;
  table: Table<T>;
}

const TablePagination = <T,>({
  pagination,
  table,
}: TablePaginationProps<T>) => {
  const intl = useIntl();
  const [, setSearchParams] = useSearchParams();

  const handlePageSizeChange = (newPageSize: number) => {
    if (pagination) {
      table.setPageSize(newPageSize);

      setSearchParams((previous) => {
        const newParams = new URLSearchParams(previous);
        if (newPageSize === pagination.initialState?.pageSize) {
          newParams.delete(SEARCH_PARAM_KEY.PAGE_SIZE);
        } else {
          newParams.set(SEARCH_PARAM_KEY.PAGE_SIZE, String(newPageSize));
        }
        return newParams;
      });

      if (pagination.onPaginationChange) {
        pagination.onPaginationChange({
          pageIndex: table.getState().pagination.pageIndex,
          pageSize: newPageSize,
        });
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (pagination) {
      const newPageIndex = newPage - 1;
      table.setPageIndex(newPageIndex);

      setSearchParams((previous) => {
        const newParams = new URLSearchParams(previous);
        if (newPageIndex === pagination.initialState?.pageIndex) {
          newParams.delete(SEARCH_PARAM_KEY.PAGE);
        } else {
          newParams.set(SEARCH_PARAM_KEY.PAGE, String(newPage));
        }
        return newParams;
      });

      if (pagination.onPaginationChange) {
        pagination.onPaginationChange({
          pageIndex: newPageIndex,
          pageSize: table.getState().pagination.pageSize,
        });
      }
    }
  };

  const tablePaginationState = table.getState().pagination;

  return (
    <Pagination
      data-h2-margin-top="base(x.5)"
      color="black"
      ariaLabel={intl.formatMessage({
        defaultMessage: "Page navigation",
        description: "Label for the table pagination",
        id: "N3sUUc",
      })}
      currentPage={tablePaginationState.pageIndex + 1}
      pageSize={tablePaginationState.pageSize}
      pageSizes={pagination.pageSizes}
      totalCount={pagination.total}
      totalPages={
        table.getPageCount() ??
        Math.ceil(pagination?.total ?? 0 / tablePaginationState.pageSize)
      }
      onPageSizeChange={handlePageSizeChange}
      onCurrentPageChange={handlePageChange}
    />
  );
};

export default TablePagination;
