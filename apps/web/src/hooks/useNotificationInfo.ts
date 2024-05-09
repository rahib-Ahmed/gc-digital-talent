import { IntlShape, useIntl } from "react-intl";
import React from "react";

import {
  ApplicationDeadlineApproachingNotification,
  Notification,
  PoolCandidateStatusChangedNotification,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocalizedName,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import {
  formDateStringToDate,
  formatDate,
} from "@gc-digital-talent/date-helpers";
import { useLogger } from "@gc-digital-talent/logger";
import { GraphqlType } from "@gc-digital-talent/helpers";

import useRoutes from "./useRoutes";

type NotificationInfo = {
  message: React.ReactNode;
  label: string;
  href: string;
};

function isPoolCandidateStatusChangedNotification(
  notification: GraphqlType,
): notification is PoolCandidateStatusChangedNotification {
  return notification.__typename === "PoolCandidateStatusChangedNotification";
}

const poolCandidateStatusChangedNotificationToInfo = (
  notification: PoolCandidateStatusChangedNotification,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
): NotificationInfo | null => {
  if (!notification.poolCandidateId) return null;
  const poolName = getLocalizedName(notification.poolName, intl);
  const oldStatus = intl.formatMessage(
    notification.oldStatus
      ? getPoolCandidateStatus(notification.oldStatus)
      : commonMessages.notAvailable,
  );
  const newStatus = intl.formatMessage(
    notification.newStatus
      ? getPoolCandidateStatus(notification.newStatus)
      : commonMessages.notAvailable,
  );

  return {
    message: intl.formatMessage(
      {
        defaultMessage:
          "Your status has changed from <heavyPrimary>{oldStatus}</heavyPrimary> to <heavyPrimary>{newStatus}</heavyPrimary> in {poolName}.",
        id: "EUukwf",
        description: "Notification message for pool candidate status changed",
      },
      {
        oldStatus,
        newStatus,
        poolName,
      },
    ),
    href: paths.application(notification.poolCandidateId),
    label: intl.formatMessage(
      {
        defaultMessage: "Status change for {poolName}",
        id: "OvGt/x",
        description: "Label for the pool status changed notification",
      },
      { poolName },
    ),
  };
};

function isApplicationDeadlineApproachingNotification(
  notification: GraphqlType,
): notification is ApplicationDeadlineApproachingNotification {
  return (
    notification.__typename === "ApplicationDeadlineApproachingNotification"
  );
}

const applicationDeadlineApproachingNotificationToInfo = (
  notification: ApplicationDeadlineApproachingNotification,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
): NotificationInfo => {
  const poolNameLocalized = getLocalizedName(notification.poolName, intl);
  const closingDateObject = formDateStringToDate(
    notification.closingDate ?? "1900-01-01",
  );
  const closingDateFormatted = formatDate({
    date: closingDateObject,
    formatString: "PPP",
    intl,
  });

  return {
    message: intl.formatMessage(
      {
        defaultMessage:
          "{poolName} closes on {closingDate}. Continue your application.",
        id: "fAJPpJ",
        description:
          "Message for application deadline approaching notification",
      },
      {
        poolName: poolNameLocalized,
        closingDate: closingDateFormatted,
      },
    ),
    href: notification.poolCandidateId
      ? paths.application(notification.poolCandidateId)
      : "",
    label: intl.formatMessage(
      {
        defaultMessage: "{poolName} closes on {closingDate}.",
        id: "OWYrdr",
        description:
          "Label for the application deadline approaching notification",
      },
      {
        poolName: poolNameLocalized,
        closingDate: closingDateFormatted,
      },
    ),
  };
};

const useNotificationInfo = (
  notification: Notification & GraphqlType,
): NotificationInfo | null => {
  const intl = useIntl();
  const paths = useRoutes();
  const logger = useLogger();

  if (isPoolCandidateStatusChangedNotification(notification)) {
    return poolCandidateStatusChangedNotificationToInfo(
      notification,
      paths,
      intl,
    );
  }

  if (isApplicationDeadlineApproachingNotification(notification)) {
    return applicationDeadlineApproachingNotificationToInfo(
      notification,
      paths,
      intl,
    );
  }

  logger.warning(
    `Could not create NotificationInfo for ${notification.__typename}`,
  );
  return null;
};

export default useNotificationInfo;
