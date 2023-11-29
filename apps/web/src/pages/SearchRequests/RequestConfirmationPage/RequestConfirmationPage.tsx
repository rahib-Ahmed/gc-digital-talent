import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";

import {
  Alert,
  Heading,
  ThrowNotFound,
  Button,
  Link,
} from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import { Scalars } from "~/api/generated";
import printStyles from "~/styles/printStyles";

import RequestConfirmationPrintDocument from "./components/RequestConfirmationPrintDocument";

type RequestConfirmationParams = {
  requestId: Scalars["ID"];
};

const mailLink = (chunks: React.ReactNode) => (
  <Link external href="mailto:recruitmentimit-recrutementgiti@tbs-sct.gc.ca">
    {chunks}
  </Link>
);

const RequestConfirmationPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { requestId } =
    useRequiredParams<RequestConfirmationParams>("requestId");

  const crumbs = useBreadcrumbs([
    {
      label: intl.formatMessage({
        defaultMessage: "Search for talent",
        id: "weLwJA",
        description: "Link text for the search page breadcrumb",
      }),
      url: paths.search(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Request submitted",
        id: "0zo274",
        description: "Link text for request confirmation breadcrumb",
      }),
      url: paths.requestConfirmation(requestId),
    },
  ]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Successful request",
    id: "DcpFle",
    description: "Page title for the request confirmation page.",
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: intl.formatMessage({
      defaultMessage: "Request submitted",
      id: "0zo274",
      description: "Link text for request confirmation breadcrumb",
    }),
  });

  return requestId ? (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage: "Your request was submitted successfully.",
          id: "rVgBGi",
          description: "Subtitle for the request confirmation page.",
        })}
        crumbs={crumbs}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <Alert.Root type="success" live={false} data-h2-margin="base(x3, 0)">
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage: "We have received your request",
              id: "7DYnwq",
              description:
                "Paragraph one, message to user the request was received",
            })}
          </Alert.Title>
          <p data-h2-margin-top="base(x1)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Your tracking number for this request is: <strong>{requestId}</strong>",
                id: "amxWPg",
                description:
                  "Message to the user about the ID of their request for referencing the request",
              },
              { requestId },
            )}
          </p>
          <Heading
            level="h3"
            data-h2-font-size="base(body)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x1, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "What you can expect",
              id: "N/Vcp3",
              description:
                "Heading for the section about user expectations for their request",
            })}
          </Heading>
          <p data-h2-margin="base(0, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "You will receive a follow up on your request within the next 5 to 10 business days.",
              id: "3rbRfI",
              description:
                "Description of when the user should expect a response to their request",
            })}{" "}
            {intl.formatMessage(
              {
                defaultMessage:
                  "If you have not heard from us or have any questions, please get in touch with us at: <mailLink>recruitmentimit-recrutementgiti@tbs-sct.gc.ca</mailLink>",
                id: "TsUcCM",
                description:
                  "Description of how a user can contact someone for answers/information on their existing request",
              },
              {
                mailLink,
              },
            )}
          </p>
          <div
            data-h2-display="print(none) base(flex)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-align-items="base(center)"
            data-h2-gap="base(x1)"
            data-h2-flex-direction="base(row)"
          >
            <Button mode="solid" color="primary" onClick={handlePrint}>
              {intl.formatMessage({
                defaultMessage: "Print this information",
                id: "idu0MU",
                description:
                  "Button text to print the request confirmation page",
              })}
            </Button>
            <RequestConfirmationPrintDocument
              requestId={requestId}
              ref={componentRef}
            />
            <Link mode="inline" href={paths.search()} color="secondary">
              {intl.formatMessage({
                defaultMessage: "Create a new talent request",
                id: "+d2TiI",
                description: "Link text to start a new talent request",
              })}
            </Link>
          </div>
        </Alert.Root>
      </div>
    </>
  ) : (
    <ThrowNotFound />
  );
};

export default RequestConfirmationPage;
