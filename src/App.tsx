import { Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
// import { Login } from './components/login/Login';
import { Results } from './components/results/Results';
import { Taxonomy } from './components/taxonomy/Taxonomy';
import { Sources } from './components/sources/Sources';
import { Details } from './components/details/Details';
import { Sidebar } from './components/sidebar/Sidebar';
import { Login } from './components/login/Login';
import { PrivateRoutes } from './components/private-routes/PrivateRoutes';
import { setGlobalState, useGlobalState } from './app/store';

import './App.css';

function App() {
  const [user, setUser] = useGlobalState('user');
    
  const token = window.localStorage.getItem('jwt')
  if(token && !Object.keys(user).length ) {
    setUser({jwt: token})
  }

  return (
    <main className="main">
      <HelmetProvider>
        <Helmet>
          <title>{"ibex"}</title>
        </Helmet>
      </HelmetProvider>
      <Sidebar />
      <Routes>
        <Route path="/" element={<PrivateRoutes />} >
          <Route path="frontend/" element={<Results />} />
          <Route path="frontend/results/*" element={<Results />} />
          <Route path="frontend/taxonomy/*" element={<Taxonomy />} />
          <Route path="frontend/sources" element={<Sources />} />
          <Route path="frontend/details/:postId" element={<Details />} />
        </Route>
        <Route path="frontend/login" element={<Login />} />
      </Routes>
    </main>
  );
}

export default App;
