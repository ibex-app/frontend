import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { setGlobalState, useGlobalState } from '../../app/store';

export const PrivateRoutes = () => {
  const location = useLocation();
  const [user, setUser] = useGlobalState('user');
  const authLogin = false
  
  

//   const getJWTToken = () => {
//       var req = new XMLHttpRequest();
//       req.onreadystatechange = function() {
//           if (req.readyState === 4) {
//               console.log(req.response);
//               if (req.response["result"] === true) {
//                   setUser({token: 1111111})
//                   console.log(req.response)
//                   window.localStorage.setItem('jwt', req.response["access_token"]);
//                   window.localStorage.setItem('refresh', req.response["refresh_token"]);
//               }
//           }
//       }
//       req.withCredentials = true;
//       req.responseType = 'json';
//       req.open("get", "https://ibex-app.com/token?"+window.location.search.substr(1), true);
//       req.send("");
//   }

  return Object.keys(user).length 
    ? <Outlet />
    : <Navigate to="login" replace state={{ from: location }} />;
}