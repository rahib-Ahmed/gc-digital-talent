import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { Input } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import {
  convertDateTimeZone,
  currentDate,
} from "@gc-digital-talent/date-helpers";

import {
  PoolAdvertisement,
  UpdatePoolAdvertisementInput,
} from "~/api/generated";

type FormValues = {
  endDate?: PoolAdvertisement["closingDate"];
};

export type ExtendSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "closingDate"
>;

type ExtendDialogProps = {
  closingDate: PoolAdvertisement["closingDate"];
  onExtend: (submitData: ExtendSubmitData) => Promise<void>;
};

const ExtendDialog = ({
  closingDate,
  onExtend,
}: ExtendDialogProps): JSX.Element => {
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);

  const handleExtend = useCallback(
    async (formValues: FormValues) => {
      const closingDateInUtc = formValues.endDate
        ? convertDateTimeZone(
            `${formValues.endDate} 23:59:59`,
            "Canada/Pacific",
            "UTC",
          )
        : null;

      await onExtend({
        closingDate: closingDateInUtc,
      }).then(() => setOpen(false));
    },
    [onExtend],
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      endDate: closingDate
        ? new Date(closingDate).toISOString().split("T")[0]
        : "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="secondary" mode="solid">
          {intl.formatMessage({
            defaultMessage: "Extend the date",
            id: "jiUwae",
            description: "Text on a button to extend the expiry date the pool",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Extend Closing Date",
            id: "3mrTn5",
            description: "Heading for the extend pool closing date dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "The closing time will be automatically set to 11:59 PM in the Pacific time zone.",
              id: "Aaas0w",
              description: "Helper message for changing the pool closing date",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage: "Write a new closing date:",
              id: "BQsJSG",
              description:
                "First paragraph for extend pool closing date dialog",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleExtend)}>
              <Input
                id="extendDialog-endDate"
                label={intl.formatMessage({
                  defaultMessage: "End Date",
                  id: "80DOGy",
                  description:
                    "Label displayed on the pool candidate form end date field.",
                })}
                type="date"
                name="endDate"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                  min: {
                    value: currentDate(),
                    message: intl.formatMessage(errorMessages.futureDate),
                  },
                }}
              />
              <Dialog.Footer>
                <div style={{ flexGrow: 2 } /* push other div to the right */}>
                  <Dialog.Close>
                    <Button mode="outline" color="secondary">
                      {intl.formatMessage({
                        defaultMessage: "Cancel and go back",
                        id: "tiF/jI",
                        description: "Close dialog button",
                      })}
                    </Button>
                  </Dialog.Close>
                </div>
                <div>
                  <Button
                    mode="solid"
                    color="secondary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? intl.formatMessage(commonMessages.saving)
                      : intl.formatMessage({
                          defaultMessage: "Extend closing date",
                          id: "OIk63O",
                          description:
                            "Button to extend the pool closing date in the extend pool closing date dialog",
                        })}
                  </Button>
                </div>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExtendDialog;
