import React from "react";
import { useParams } from "react-router-dom";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";

import { PoolCandidate, useGetApplicationQuery } from "~/api/generated";

export type ApplicationPageProps = {
  application: PoolCandidate;
};

interface ApplicationApiProps {
  PageComponent: (props: ApplicationPageProps) => JSX.Element;
}

const ApplicationApi = ({ PageComponent }: ApplicationApiProps) => {
  const { applicationId } = useParams();
  const [{ data, fetching, error, stale }] = useGetApplicationQuery({
    requestPolicy: "cache-first",
    variables: {
      id: applicationId || "",
    },
  });

  const application = data?.poolCandidate;

  return (
    <Pending fetching={fetching || stale} error={error}>
      {application?.pool ? (
        <PageComponent application={application} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationApi;
