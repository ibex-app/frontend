import { Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
// import { Login } from './components/login/Login';
import { Results } from './components/results/Results';
import { Taxonomy } from './components/taxonomy/Taxonomy';
import { Sources } from './components/sources/Sources';
import { Details } from './components/details/Details';
import { Sidebar } from './components/sidebar/Sidebar';

import './App.css';

function App() {
  return (
    <main className="main">
      <HelmetProvider>
        <Helmet>
          <title>{"ibex"}</title>
        </Helmet>
      </HelmetProvider>
      <Sidebar />
      <Routes>
        <Route path="frontend/" element={<Results />} />
        <Route path="frontend/results/*" element={<Results />} />
        <Route path="frontend/taxonomy/*" element={<Taxonomy />} />
        <Route path="frontend/sources" element={<Sources />} />
        <Route path="frontend/details/:postId" element={<Details />} />
      </Routes>
    </main>
  );
}

export default App;
