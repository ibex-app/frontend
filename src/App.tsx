import { Routes, Route } from "react-router-dom";

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
      <Sidebar />
      <Routes>
        <Route path="/" element={<Results />} />
        <Route path="results/*" element={<Results />} />
        <Route path="taxonomy" element={<Taxonomy />} />
        <Route path="sources" element={<Sources />} />
        <Route path="details/:postId" element={<Details />} />
      </Routes>
    </main>
  );
}

export default App;
