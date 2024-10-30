import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes=({requiredRole}) => {


  const role = sessionStorage.getItem("roles");
  const userRoles = role ? role.split(',') : []; // Split roles into an array
  if (!requiredRole.some(r => userRoles.includes(r))) {
      return <Navigate to="/" />;
  }
  
  return <Outlet/>
}

export default ProtectedRoutes;
