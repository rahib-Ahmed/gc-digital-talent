import React from "react";
import { useIntl } from "react-intl";
import { Table } from "@tanstack/react-table";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Field } from "@gc-digital-talent/forms";

import adminMessages from "~/messages/adminMessages";

interface ColumnVisibilityProps<TData> {
  table: Table<TData>;
}

const ColumnVisibility = <T extends object>({
  table,
}: ColumnVisibilityProps<T>) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button icon={TableCellsIcon} color="quaternary" type="button">
          {intl.formatMessage(adminMessages.showHideColumns)}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(adminMessages.showHideColumns)}
        </Dialog.Header>
        <Dialog.Body>
          <Field.Fieldset boundingBox>
            <Field.Legend>
              {intl.formatMessage(adminMessages.showHideTableColumns)}
            </Field.Legend>
            <div data-h2-margin="base(x.125, 0)">
              <label>
                <input
                  {...{
                    type: "checkbox",
                    checked: table.getIsAllColumnsVisible(),
                    onChange: table.getToggleAllColumnsVisibilityHandler(),
                    indeterminate: table.getIsSomeColumnsVisible(),
                  }}
                />{" "}
                {intl.formatMessage({
                  defaultMessage: "Toggle All",
                  id: "7d/ot8",
                  description:
                    "Label displayed on the Table Columns toggle fieldset.",
                })}
              </label>
            </div>
            {table.getAllLeafColumns().map((column) => (
              <div key={column.id} data-h2-margin="base(x.125, 0)">
                <label>
                  <input
                    {...{
                      type: "checkbox",
                      checked: column.getIsVisible(),
                      onChange: column.getToggleVisibilityHandler(),
                    }}
                  />{" "}
                  {column.columnDef.header?.toString() || ""}
                </label>
              </div>
            ))}
          </Field.Fieldset>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ColumnVisibility;
