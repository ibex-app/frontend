import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { setGlobalState, useGlobalState } from '../../app/store';

export const PrivateRoutes = () => {
  const location = useLocation();
  const [user, setUser] = useGlobalState('user');
  const authLogin = false
  
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("code")
// state
// code
// scope
// authuser
// prompt
  console.log("authLogin", token);
  
  if(token && !Object.keys(user).length){
    setUser({token: token})
  }

  return Object.keys(user).length 
    ? <Outlet />
    : <Navigate to="frontend/login" replace state={{ from: location }} />;
}