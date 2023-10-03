import React, { ReactElement, useId } from "react";
import { useIntl } from "react-intl";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";
import { FormProvider, useForm } from "react-hook-form";

import { Button, Link, Dialog } from "@gc-digital-talent/ui";
import { Field } from "@gc-digital-talent/forms";

import adminMessages from "~/messages/adminMessages";

import IndeterminateCheckbox from "./IndeterminateCheckbox";
import SearchForm from "./SearchForm";
import type {
  ColumnHiddenEvent,
  ColumnsOf,
  IdType,
  SearchColumn,
  SearchState,
} from "./helpers";

interface TableHeaderProps<T extends Record<string, unknown>> {
  onSearchChange: (
    val: string | undefined,
    col: SearchColumn["value"] | undefined,
  ) => void;
  columns: ColumnsOf<T>;
  initialSearchState?: SearchState;
  searchBy?: Array<SearchColumn>;
  addBtn?: {
    path: string;
    label: string;
  };
  filter?: boolean;
  title?: string;
  onColumnHiddenChange?: (e: ColumnHiddenEvent<T>) => void;
  hiddenColumnIds: Array<IdType<T>>;
  filterComponent: React.ReactNode;
}

function TableHeader<T extends Record<string, unknown>>({
  onSearchChange,
  searchBy,
  initialSearchState,
  columns,
  addBtn,
  filter = true,
  title,
  onColumnHiddenChange,
  hiddenColumnIds,
  filterComponent,
}: TableHeaderProps<T>): ReactElement {
  const intl = useIntl();
  const methods = useForm();

  const staticId = useId();
  const inputId = `table-search-${staticId}`;
  const inputLabel = intl.formatMessage(
    {
      defaultMessage: "Search {title}",
      id: "/7RNZm",
      description: "Label for search input",
    },
    {
      title: title?.toLowerCase(),
    },
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {filter && (
        <div data-h2-margin="base(x2, 0, x.5, 0)">
          <p>
            {title && (
              <label data-h2-font-weight="base(700)" htmlFor={inputId}>
                {inputLabel}
              </label>
            )}
          </p>
          <div data-h2-flex-grid="base(center, x1)">
            <div data-h2-flex-item="base(1of1) l-tablet(fill)">
              <div data-h2-flex-grid="base(center, x.5)">
                <div data-h2-flex-item="base(content)">
                  <SearchForm
                    onChange={onSearchChange}
                    searchBy={searchBy}
                    initialData={initialSearchState}
                    inputId={inputId}
                    inputLabel={inputLabel}
                  />
                </div>
                <div data-h2-flex-item="base(content)">{filterComponent}</div>
                <div data-h2-flex-item="base(content)">
                  <div data-h2-position="base(relative)">
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <Button
                          color="secondary"
                          type="button"
                          icon={TableCellsIcon}
                        >
                          {intl.formatMessage(adminMessages.showHideColumns)}
                        </Button>
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Header>
                          {intl.formatMessage(adminMessages.showHideColumns)}
                        </Dialog.Header>
                        <Dialog.Body>
                          <FormProvider {...methods}>
                            <Field.Fieldset>
                              <Field.Legend>
                                {intl.formatMessage(
                                  adminMessages.showHideTableColumns,
                                )}
                              </Field.Legend>
                              <Field.BoundingBox>
                                <div data-h2-margin="base(x.125, 0)">
                                  <IndeterminateCheckbox
                                    checked={hiddenColumnIds.length === 0}
                                    indeterminate={
                                      hiddenColumnIds.length > 0 &&
                                      hiddenColumnIds.length < columns.length
                                    }
                                    onChange={() => {
                                      if (onColumnHiddenChange) {
                                        onColumnHiddenChange({
                                          setHidden:
                                            hiddenColumnIds.length === 0,
                                        });
                                      }
                                    }}
                                  />
                                </div>
                              </Field.BoundingBox>
                              {columns.map((column) => (
                                <div
                                  key={column.id}
                                  data-h2-margin="base(x.125, 0)"
                                >
                                  <label htmlFor={column.id}>
                                    <input
                                      id={column.id}
                                      type="checkbox"
                                      checked={
                                        !hiddenColumnIds.includes(column.id)
                                      }
                                      onChange={() => {
                                        if (onColumnHiddenChange) {
                                          onColumnHiddenChange({
                                            columnId: column.id,
                                            setHidden:
                                              !hiddenColumnIds.includes(
                                                column.id,
                                              ),
                                          });
                                        }
                                      }}
                                    />{" "}
                                    {column.label}
                                  </label>
                                </div>
                              ))}
                            </Field.Fieldset>
                          </FormProvider>
                        </Dialog.Body>
                      </Dialog.Content>
                    </Dialog.Root>
                  </div>
                </div>
              </div>
            </div>
            <div data-h2-flex-item="base(1of1) l-tablet(content)">
              {addBtn && (
                <Link
                  mode="solid"
                  color="primary"
                  icon={PlusIcon}
                  style={{ textDecoration: "none" }}
                  href={addBtn.path}
                >
                  {addBtn.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TableHeader;
