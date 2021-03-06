import { Routes, Route, useSearchParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Results } from './components/results/Results';
import { Taxonomy } from './components/taxonomy/Taxonomy';
import { Sources } from './components/sources/Sources';
import { Details } from './components/details/Details';
import { Login } from './components/login/Login';
import { PrivateRoutes } from './components/private-routes/PrivateRoutes';
import { useGlobalState } from './app/store';

import './App.css';
import { Col, Row } from "antd";

function App() {
  const [user, setUser] = useGlobalState('user');

  const [searchParams, setSearchParams] = useSearchParams();
  const token_param = searchParams.get("access_token")
  const storage_token = window.localStorage.getItem('jwt')
  const token = token_param || storage_token

  if (token && !Object.keys(user).length) {
    setUser({ jwt: token })

    if (!storage_token) window.localStorage.setItem('jwt', token);
    // window.localStorage.setItem('refresh', req.response["refresh_token"]);
    // setUser({email: searchParams.get("user"), jwt: token})
  }

  return (
    <Row>
      <HelmetProvider>
        <Helmet>
          <title>{"ibex"}</title>
        </Helmet>
      </HelmetProvider>
      <Col span={24}>
        <Routes>
          <Route path="/" element={<PrivateRoutes />} >
            <Route path="/" element={<Results />} />
            <Route path="/results/*" element={<Results />} />
            <Route path="/taxonomy/*" element={<Taxonomy />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/details/:postId" element={<Details />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Col>
    </Row>
  );
}

export default App;
