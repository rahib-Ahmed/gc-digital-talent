import React from "react";
import { useIntl } from "react-intl";
import { TrashIcon } from "@heroicons/react/24/outline";

import { Dialog, Button, Pill } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { Team, useUpdateUserAsAdminMutation } from "~/api/generated";
import { getFullNameLabel } from "~/utils/nameUtils";
import { TeamMember } from "~/utils/teamUtils";
import { toast } from "@gc-digital-talent/toast";

interface RemoveTeamMemberDialogProps {
  user: TeamMember;
  team: Team;
}

const RemoveTeamMemberDialog = ({
  user,
  team,
}: RemoveTeamMemberDialogProps) => {
  const intl = useIntl();
  const [{ fetching }, executeMutation] = useUpdateUserAsAdminMutation();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleRemove = async () => {
    await executeMutation({
      id: user.id,
      user: {
        roles: {
          detach: {
            roles: user.roles.map((role) => role.id),
            team: team.id,
          },
        },
      },
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Member removed from team successfully",
              id: "guzGyX",
              description:
                "Alert displayed to user when a team member is removed",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Member removed from team failed",
            id: "7Mbt01",
            description:
              "Alert displayed to user when an error occurs while removing a team member",
          }),
        );
      });
  };

  const userName = getFullNameLabel(user.firstName, user.lastName, intl);
  const teamName = getLocalizedName(team.displayName, intl);

  const label = intl.formatMessage({
    defaultMessage: "Remove member",
    id: "DyHeaZ",
    description: "Label for the dialog to remove a users team membership",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="red" mode="outline" aria-label={label}>
          <TrashIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-secondary">{label}</Dialog.Header>
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "You are about to remove <strong>{userName}</strong> from the team <strong>{teamName}</strong>.",
              id: "/esEW+",
              description: "Help text for the remove team membership dialog",
            },
            {
              userName,
              teamName,
            },
          )}
        </p>
        {user.roles.length ? (
          <>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "They will love all of the following team roles:",
                id: "nAyAWe",
                description:
                  "Lead text for the list of roles the user will lose",
              })}
            </p>
            <ul
              data-h2-display="base(flex)"
              data-h2-flex-wrap="base(wrap)"
              data-h2-list-style="base(none)"
              data-h2-padding="base(0)"
              data-h2-gap="base(x.25)"
            >
              {user.roles.map((role) => (
                <li key={role.id}>
                  <Pill mode="solid" color="neutral">
                    {getLocalizedName(role.displayName, intl)}
                  </Pill>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <Dialog.Footer>
          <Dialog.Close>
            <Button mode="outline" color="secondary">
              {intl.formatMessage({
                defaultMessage: "Cancel and go back",
                id: "tiF/jI",
                description: "Close dialog button",
              })}
            </Button>
          </Dialog.Close>
          <Button
            mode="solid"
            color="red"
            onClick={handleRemove}
            disabled={fetching}
          >
            {fetching ? intl.formatMessage(commonMessages.saving) : label}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveTeamMemberDialog;
