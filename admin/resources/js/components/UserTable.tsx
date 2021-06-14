import React, { useMemo } from "react";
import { Column } from "react-table";
import Table from "./Table";

interface UserTableProps {
  users: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    preferredLang: string;
  }>;
}

const UserTable: React.FC<UserTableProps> = (users) => {
  const columns: Array<Column> = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Telephone",
        accessor: "telephone",
      },
      {
        Header: "Preferred Language",
        accessor: "preferredLang",
      },
    ],
    [],
  );

  const data = useMemo(() => users, [users]);

  return (
    <>
      <Table data={data.users} columns={columns} />
    </>
  );
};

export default UserTable;
