import React from "react";
import { Routes } from "universal-router";
import { createClient } from "urql";
import { Link, RouterResult, useLocation } from "../helpers/router";
import { ApiClassificationTable } from "./ClassificationTable";
import ClientProvider from "./ClientProvider";
import CreateUser from "./CreateUser";
import { Dashboard, exactMatch, MenuLink } from "./dashboard/Dashboard";
import { UpdateUser } from "./UpdateUser";
import { ApiUserTable } from "./UserTable";

const routes: Routes<RouterResult> = [
  {
    path: "/dashboard",
    action: () => ({
      component: <p>Welcome Home</p>,
    }),
  },
  {
    path: "/dashboard/users",
    action: () => ({
      component: (
        <div>
          <Link href="/dashboard/users/create" title="">
            Create User
          </Link>
          <ApiUserTable />,
        </div>
      ),
    }),
  },
  {
    path: "/dashboard/users/create",
    action: () => ({
      component: <CreateUser />,
    }),
  },
  {
    path: "/dashboard/users/:id/edit",
    action: ({ params }) => ({
      component: <UpdateUser userId={params.id as string} />,
    }),
  },
  {
    path: "/dashboard/classifications",
    action: () => ({
      component: <ApiClassificationTable />,
    }),
  },
];

const menuItems = [
  <MenuLink key="home" href="/dashboard" text="Home" isActive={exactMatch} />,
  <MenuLink key="users" href="/dashboard/users" text="Users" />,
  <MenuLink
    key="users"
    href="/dashboard/classifications"
    text="Classifications"
  />,
];

const client = createClient({
  url: "http://localhost:8000/graphql",
});

export const PoolDashboard: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <ClientProvider client={client}>
        <Dashboard menuItems={menuItems} contentRoutes={routes} />
      </ClientProvider>
    </div>
  );
};

export default PoolDashboard;
