import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const PrivateRoutes = () => {
  const location = useLocation();
  // const { authLogin } = useContext(globalC);
  const authLogin = true
  console.log("authLogin", authLogin);

  return authLogin 
    ? <Outlet />
    : <Navigate to="frontend/login" replace state={{ from: location }} />;
}