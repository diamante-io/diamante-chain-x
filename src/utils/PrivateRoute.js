import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {
  let auth = { token: sessionStorage.getItem("accessToken") };
  return auth.token !== "" && auth.token !== null ? (
    <Outlet />
  ) : (
    <Navigate to="../" />
  );
};
export default PrivateRoute;
