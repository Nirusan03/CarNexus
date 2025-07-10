import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const roleId = parseInt(localStorage.getItem("role_id"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes(roleId)) {
    return <Outlet />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;
