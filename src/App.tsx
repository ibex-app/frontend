import { Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
// import { Login } from './components/login/Login';
import { Results } from './components/results/Results';
import { Taxonomy } from './components/taxonomy/Taxonomy';
import { TaxonomyInit } from './components/taxonomy/TaxonomyInit';
import { TaxonomyParams } from './components/taxonomy/TaxonomyParams';
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
        <Route path="/" element={<Results />}/>
        <Route path="results/*" element={<Results />} />
        <Route path="taxonomy-init" element={<TaxonomyInit />} />
        <Route path="taxonomy-params" element={<TaxonomyParams />} />
        <Route path="taxonomy" element={<Taxonomy />} />
        <Route path="sources" element={<Sources />} />
        <Route path="details/:postId" element={<Details />} />
      </Routes>
    </main>
  );
}

export default App;
