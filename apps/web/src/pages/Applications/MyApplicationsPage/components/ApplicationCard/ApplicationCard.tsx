import React from "react";
import { useIntl } from "react-intl";

import Heading, { HeadingLevel } from "@common/components/Heading/Heading";
import { notEmpty } from "@common/helpers/util";
import { getFullPoolAdvertisementTitleHtml } from "@common/helpers/poolUtils";

import { type PoolCandidate } from "~/api/generated";

import ApplicationActions from "./ApplicationActions";
import type {
  ArchiveActionProps,
  DeleteActionProps,
} from "./ApplicationActions";
import {
  canBeArchived,
  canBeDeleted,
  formatClosingDate,
  formatSubmittedAt,
  isDraft,
  isExpired,
  isPlaced,
} from "./utils";
import useMutations from "./useMutations";

export type Application = Omit<PoolCandidate, "pool" | "user">;

export interface ApplicationCardProps {
  application: Application;
  onDelete: DeleteActionProps["onDelete"];
  onArchive: ArchiveActionProps["onArchive"];
  headingLevel?: HeadingLevel;
}

const ApplicationCard = ({
  application,
  onDelete,
  onArchive,
  headingLevel = "h2",
}: ApplicationCardProps) => {
  const intl = useIntl();

  const applicationIsDraft = isDraft(application.status);
  const applicationCanBeArchived = canBeArchived(
    application.status,
    application.archivedAt,
  );
  const isApplicantPlaced = isPlaced(application.status);
  const applicationCanBeDeleted = canBeDeleted(application.status);
  const recruitmentIsExpired = isExpired(
    application.poolAdvertisement?.closingDate,
  );
  const submittedAt = formatSubmittedAt(application.submittedAt, intl);
  const closingDate = formatClosingDate(
    application.poolAdvertisement?.closingDate,
    intl,
  );

  return (
    <div
      data-h2-background-color="base(white)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(rounded)"
      data-h2-shadow="base(s)"
    >
      <Heading
        level={headingLevel}
        size="h6"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {application.poolAdvertisement
          ? getFullPoolAdvertisementTitleHtml(
              intl,
              application.poolAdvertisement,
            )
          : ""}
      </Heading>
      <p data-h2-margin="base(x1, 0)">
        {applicationIsDraft
          ? intl.formatMessage(
              {
                defaultMessage:
                  "Apply by: <strong><red>{closingDate}</red></strong>",
                description:
                  "Text notifying user of closing date for an application",
                id: "eqVWC6",
              },
              { closingDate },
            )
          : intl.formatMessage(
              {
                defaultMessage: "Applied on: <strong>{submittedAt}</strong>",
                description:
                  "Text notifying user of closing date for an application",
                id: "NbOOsf",
              },
              { submittedAt },
            )}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(x1)"
        data-h2-justify-content="base(space-between)"
        data-h2-margin="base(x1, 0, 0, 0)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-gap="base(x1)"
        >
          <ApplicationActions.SeeAdvertisementAction
            show={notEmpty(application.poolAdvertisement)}
            advertisement={application.poolAdvertisement}
          />
          <ApplicationActions.ViewAction
            show={!applicationIsDraft}
            application={application}
          />
          <ApplicationActions.SupportAction
            show={!recruitmentIsExpired && !isApplicantPlaced}
          />
          <ApplicationActions.DeleteAction
            onDelete={onDelete}
            show={applicationCanBeDeleted}
            application={application}
          />
          <ApplicationActions.ArchiveAction
            onArchive={onArchive}
            show={applicationCanBeArchived}
            application={application}
          />
        </div>
        <ApplicationActions.ContinueAction
          show={applicationIsDraft}
          application={application}
        />
      </div>
    </div>
  );
};

interface ApplicationCardApiProps {
  application: Application;
}

const ApplicationCardApi = ({ application }: ApplicationCardApiProps) => {
  const mutations = useMutations();

  return (
    <ApplicationCard
      application={application}
      onDelete={() => mutations.delete(application.id)}
      onArchive={() => mutations.archive(application.id)}
    />
  );
};

export const ApplicationCardComponent = ApplicationCard;
export default ApplicationCardApi;
