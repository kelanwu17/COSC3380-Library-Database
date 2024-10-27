import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes=() => {


  const role = sessionStorage.getItem("roles");
  if (role === "member") {
    return <Navigate to="/" />;
  }
}

export default ProtectedRoutes;
