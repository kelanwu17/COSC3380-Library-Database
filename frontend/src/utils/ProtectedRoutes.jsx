import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes=({requiredRole =[]}) => {


  const role = sessionStorage.getItem("roles");
  if (!requiredRole.includes(role)) {
    return <Navigate to="/" />; // Redirect to home if role doesn't match
  }
  
  return <Outlet/>
}

export default ProtectedRoutes;
