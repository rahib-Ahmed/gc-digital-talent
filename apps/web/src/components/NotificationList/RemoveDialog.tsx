import React from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { AlertDialog, Button, DropdownMenu } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Scalars } from "@gc-digital-talent/graphql";

import { DeleteNotification_Mutation } from "./mutations";

type RemoveDialogProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenu.Item
> & {
  id: Scalars["UUID"]["output"];
  message: React.ReactNode;
  date: string;
};

const RemoveDialog = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  RemoveDialogProps
>(({ id, message, date, onSelect, ...rest }, forwardedRef) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [{ fetching: deleting }, executeDeleteMutation] = useMutation(
    DeleteNotification_Mutation,
  );

  const handleDelete = () => {
    executeDeleteMutation({ id }).then((res) => {
      if (res.data?.deleteNotification) {
        setIsOpen(false);
      }
    });
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        <DropdownMenu.Item
          ref={forwardedRef}
          color="error"
          onSelect={(event) => {
            event.preventDefault();
            onSelect?.(event);
          }}
          {...rest}
        >
          {intl.formatMessage(commonMessages.delete)}
        </DropdownMenu.Item>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage({
            defaultMessage:
              "Are you sure you want to delete this notification?",
            id: "XdynkW",
            description:
              "Heading for confirmation alert to delete a notification",
          })}
        </AlertDialog.Title>
        <AlertDialog.Description>
          <p
            data-h2-font-size="base(caption)"
            data-h2-color="base(black.light)"
            data-h2-margin-bottom="base(x.5)"
          >
            {date}
          </p>
          <div>{message}</div>
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Action>
            <Button color="error" disabled={deleting} onClick={handleDelete}>
              {intl.formatMessage({
                defaultMessage: "Delete notification",
                id: "YaDJN+",
                description: "Button text to confirm deleting a notification",
              })}
            </Button>
          </AlertDialog.Action>
          <AlertDialog.Cancel>
            <Button mode="inline" color="quaternary">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
});

export default RemoveDialog;
