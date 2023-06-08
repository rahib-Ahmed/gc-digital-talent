import React from "react";
import { useIntl } from "react-intl";

import { AlertDialog, Button, Link } from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

import type { Application } from "./ApplicationCard";

export interface ActionProps {
  show: boolean;
}

export interface ContinueActionProps extends ActionProps {
  application: Application;
}

const ContinueAction = ({ show, application }: ContinueActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { pool } = application;
  const { applicationRevamp } = useFeatureFlags();
  const href = applicationRevamp
    ? paths.application(application.id)
    : paths.reviewApplication(application.id);

  if (!show) {
    return null;
  }

  return (
    <div data-h2-margin="base(0, 0, 0, auto)">
      <Link mode="inline" href={href}>
        {intl.formatMessage(
          {
            defaultMessage: "Continue this application<hidden> {name}</hidden>",
            id: "51B5l9",
            description: "Link text to continue a specific application",
          },
          {
            name: getFullPoolTitleHtml(intl, pool),
          },
        )}
      </Link>
    </div>
  );
};
export interface ViewActionProps extends ActionProps {
  application: Application;
}

const ViewAction = ({ show, application }: ViewActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { pool } = application;
  const { applicationRevamp } = useFeatureFlags();
  const href = applicationRevamp
    ? paths.application(application.id)
    : paths.reviewApplication(application.id);

  if (!show) {
    return null;
  }

  return (
    <Link href={href} mode="inline">
      {intl.formatMessage(
        {
          defaultMessage: "View this application<hidden> {name}</hidden>",
          id: "JM30M7",
          description: "Link text to view a specific application",
        },
        {
          name: getFullPoolTitleHtml(intl, pool),
        },
      )}
    </Link>
  );
};

export interface SeeAdvertisementActionProps extends ActionProps {
  advertisement: Application["pool"];
}

const SeeAdvertisementAction = ({
  show,
  advertisement,
}: SeeAdvertisementActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  if (!show || !advertisement) {
    return null;
  }

  return (
    <Link mode="inline" href={paths.pool(advertisement.id)}>
      {intl.formatMessage(
        {
          defaultMessage: "See job ad<hidden> {name}</hidden>",
          id: "si/wtm",
          description: "Link text to see an applications advertisement",
        },
        {
          name: getFullPoolTitleHtml(intl, advertisement),
        },
      )}
    </Link>
  );
};
export type SupportActionProps = ActionProps;

const SupportAction = ({ show }: SupportActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  if (!show) {
    return null;
  }

  return (
    <Link href={paths.support()} mode="inline">
      {intl.formatMessage({
        defaultMessage: "Get support",
        id: "rXdaZW",
        description: "Link text to direct a user to the support page",
      })}
    </Link>
  );
};

export interface DeleteActionProps extends ActionProps {
  application: Application;
  onDelete: () => void;
}

const DeleteAction = ({ show, application, onDelete }: DeleteActionProps) => {
  const intl = useIntl();

  if (!show) {
    return null;
  }

  const name = getFullPoolTitleHtml(intl, application.pool);
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button mode="inline" type="button" color="error">
          {intl.formatMessage(
            {
              defaultMessage:
                "Delete this application<hidden> ({name})</hidden>",
              id: "10Ous+",
              description: "Link text to delete a specific application",
            },
            {
              name,
            },
          )}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage(
            {
              defaultMessage: "Delete Application",
              id: "FFD16/",
              description:
                "Title for the modal that appears when a user attempts to delete an application",
            },
            { name },
          )}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {intl.formatMessage(
            {
              defaultMessage:
                "Are you sure you would like to delete application {name}?",
              id: "5pZFQ3",
              description:
                "Question displayed when user attempts to delete an application",
            },
            { name },
          )}
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button color="primary" type="button">
              {intl.formatMessage({
                defaultMessage: "Cancel",
                id: "/JLaO5",
                description: "Link text to cancel deleting application.",
              })}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button mode="solid" color="error" type="button" onClick={onDelete}>
              {intl.formatMessage({
                defaultMessage: "Delete",
                id: "IUQGA0",
                description: "Link text to delete.",
              })}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export interface ArchiveActionProps extends ActionProps {
  application: Application;
  onArchive: () => void;
}

const ArchiveAction = ({
  show,
  application,
  onArchive,
}: ArchiveActionProps) => {
  const intl = useIntl();

  if (!show) {
    return null;
  }

  const name = getFullPoolTitleHtml(intl, application.pool);

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button mode="inline" type="button" color="secondary">
          {intl.formatMessage(
            {
              defaultMessage: "Archive<hidden> application {name}</hidden>",
              id: "6B7e8/",
              description: "Link text to continue a specific application",
            },
            {
              name,
            },
          )}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage({
            defaultMessage: "Archive Application",
            id: "yiJYdP",
            description:
              "Title for the modal that appears when a user attempts to archive an application",
          })}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {intl.formatMessage(
            {
              defaultMessage:
                "Are you sure you would like to archive application {name}?",
              id: "Z0PCOW",
              description:
                "Question displayed when user attempts to archive an application",
            },
            { name },
          )}
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button color="primary" type="button">
              {intl.formatMessage({
                defaultMessage: "Cancel",
                id: "r6DZ71",
                description: "Link text to cancel archiving application.",
              })}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              mode="solid"
              color="secondary"
              type="button"
              onClick={onArchive}
            >
              {intl.formatMessage({
                defaultMessage: "Archive",
                id: "PXfQOZ",
                description: "Link text to archive application.",
              })}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default {
  ContinueAction,
  SeeAdvertisementAction,
  DeleteAction,
  ArchiveAction,
  SupportAction,
  ViewAction,
};
