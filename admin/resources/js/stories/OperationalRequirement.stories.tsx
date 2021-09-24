import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import { action } from "@storybook/addon-actions";
import {
  OperationalRequirementTable,
  OperationalRequirementTableApi,
} from "../components/operationalRequirement/OperationalRequirementTable";
import fakeOperationalRequirements from "../fakeData/fakeOperationalRequirements";
import ClientProvider from "../components/ClientProvider";
import { CreateOperationalRequirementForm } from "../components/operationalRequirement/CreateOperationalRequirement";
import {
  CreateOperationalRequirementInput,
  OperationalRequirement,
} from "../api/generated";
import { UpdateOperationalRequirementForm } from "../components/operationalRequirement/UpdateOperationalRequirement";

const operationalRequirementData = fakeOperationalRequirements();

const stories = storiesOf("Operational Requirements", module);

stories.add("Operational Requirements Table", () => (
  <OperationalRequirementTable
    operationalRequirements={operationalRequirementData}
    editUrlRoot="#"
  />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});

stories.add("Operational Requirements Table with API data", () => (
  <ClientProvider client={client}>
    <OperationalRequirementTableApi />
  </ClientProvider>
));

stories.add("Create Operational Requirement Form", () => {
  return (
    <CreateOperationalRequirementForm
      handleCreateOperationalRequirement={async (
        data: CreateOperationalRequirementInput,
      ) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Operational Requirement")(data);
        return data;
      }}
    />
  );
});

stories.add("Update Operational Requirement Form", () => {
  const operationalRequirement: OperationalRequirement =
    operationalRequirementData[0];
  return (
    <UpdateOperationalRequirementForm
      initialOperationalRequirement={operationalRequirement}
      handleUpdateOperationalRequirement={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Operational Requirement")(data);
        return data;
      }}
    />
  );
});
