import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { setGlobalState, useGlobalState } from '../../app/store';

export const PrivateRoutes = () => {
  const location = useLocation();
  const [user, _] = useGlobalState('user');
  const authLogin = false
  console.log("authLogin", user);

  return Object.keys(user).length 
    ? <Outlet />
    : <Navigate to="frontend/login" replace state={{ from: location }} />;
}