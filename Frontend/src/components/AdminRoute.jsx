import { Navigate, Outlet } from "react-router-dom";

import { getUserRole } from "../utils/jwt";

const AdminRoute = () => {
  const accessToken =
    localStorage.getItem("accessToken");

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const role = getUserRole();

  const normalizedRole =
    Array.isArray(role)
      ? role[0]
      : role;

  if (
    normalizedRole !== "ADMIN" &&
    normalizedRole !== "ROLE_ADMIN"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminRoute;