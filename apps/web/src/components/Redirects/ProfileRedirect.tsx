import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuthorization } from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

const ProfileRedirect = () => {
  const paths = useRoutes();
  const navigate = useNavigate();
  const { loggedInUser } = useAuthorization();

  React.useEffect(() => {
    if (loggedInUser) {
      navigate(paths.profile(loggedInUser.id), { replace: true });
    } else {
      navigate(paths.home(), { replace: true });
    }
  }, [loggedInUser, navigate, paths]);

  return <Loading />; // Show loading spinner while we process redirect
};

export default ProfileRedirect;
