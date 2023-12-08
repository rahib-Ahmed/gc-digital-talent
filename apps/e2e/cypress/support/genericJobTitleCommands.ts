import {
  GetGenericJobTitlesQuery,
  GetGenericJobTitlesDocument,
} from "@gc-digital-talent/web/src/api/generated";

import { getGqlString } from "./graphql-test-utils";

Cypress.Commands.add("getGenericJobTitles", () => {
  cy.graphqlRequest<GetGenericJobTitlesQuery>({
    operationName: "GetGenericJobTitles",
    query: getGqlString(GetGenericJobTitlesDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.genericJobTitles);
  });
});
