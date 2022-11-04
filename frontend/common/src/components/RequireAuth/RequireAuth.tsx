import React from "react";
import { useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useAuthorizationContext from "../../hooks/useAuthorizationContext";
import { Role } from "../../api/generated";
import { useApiRoutes } from "../../hooks/useApiRoutes";
import useLocale from "../../hooks/useLocale";

interface RequireAuthProps {
  children: React.ReactNode;
  roles: Array<Role>;
}

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const { locale } = useLocale();
  const location = useLocation();
  const apiRoutes = useApiRoutes();
  const { loggedIn } = useAuth();
  const { loggedInUserRoles } = useAuthorizationContext();

  if (!loggedIn) {
    window.location.replace(apiRoutes.login(location.pathname, locale));
    return null;
  }

  const isAuthorized =
    roles.length === 0 ||
    roles.some((authorizedRole: Role) =>
      loggedInUserRoles?.includes(authorizedRole),
    );

  if (!isAuthorized) {
    throw new Response("", {
      status: 403,
      statusText: "Unauthorized",
    });
    return null;
  }

  // Note: Need to return a React.ReactElement
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default RequireAuth;
