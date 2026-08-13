
import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  getUserRole,
} from "../utils/jwt";


const UserRoute = () => {

  const role =
    getUserRole();


  if (role !== "USER") {

    return (

      <Navigate
        to="/admin"
        replace
      />

    );

  }


  return (
    <Outlet />
  );

};


export default UserRoute;

