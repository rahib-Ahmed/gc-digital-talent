import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import { action } from "@storybook/addon-actions";
import ClientProvider from "../components/ClientProvider";
import {
  DepartmentTable,
  DepartmentTableApi,
} from "../components/department/DepartmentTable";
import fakeDepartments from "../fakeData/fakeDepartments";
import {
  CreateDepartment,
  CreateDepartmentForm,
} from "../components/department/CreateDepartment";
import { CreateDepartmentInput, Department } from "../api/generated";
import {
  UpdateDepartment,
  UpdateDepartmentForm,
} from "../components/department/UpdateDepartment";

const stories = storiesOf("Departments", module);

stories.add("Departments Table", () => (
  <DepartmentTable departments={fakeDepartments()} editUrlRoot="#" />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});

stories.add("Departments Table with API data", () => (
  <ClientProvider client={client}>
    <DepartmentTableApi />
  </ClientProvider>
));

stories.add("Create Department Form", () => {
  return (
    <CreateDepartmentForm
      handleCreateDepartment={async (data: CreateDepartmentInput) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Department")(data);
        return null;
      }}
    />
  );
});

stories.add("Create Department Form with API", () => {
  return (
    <ClientProvider client={client}>
      <CreateDepartment />
    </ClientProvider>
  );
});

stories.add("Update Department Form", () => {
  const department: Department = {
    id: "1",
    department_number: 1,
    name: {
      en: "Agriculture and Agri-Food",
      fr: "Agriculture et de l'Agroalimentaire",
    },
  };

  return (
    <UpdateDepartmentForm
      initialDepartment={department}
      handleUpdateDepartment={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Department")(data);
        return {
          id,
          department_number: data.departmentNumber || 0,
          name: data.name,
        };
      }}
    />
  );
});

stories.add("Update Department Form with API", () => {
  return (
    <ClientProvider client={client}>
      <UpdateDepartment departmentId="1" />
    </ClientProvider>
  );
});
