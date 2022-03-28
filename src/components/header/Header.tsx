import { Link } from "react-router-dom";

export const Header = () => (
  <header className="header">
    <nav className="nav">
      {/* <a className="is-active" href="/results" >Table</a> */}
      <Link to="/results" >Table</Link>
      <Link to="/results/bar" >Bar</Link>
      <Link to="/results/graph" >Graph</Link>
      <Link to="/results/line" >Line</Link>
      <Link to="/results/bubble" >Bubble</Link>
      <Link to="/results/map" >Map</Link>
    </nav>
    <div className="tools">
      <i className="icn icn--save"></i>
      <i className="icn icn--voice"></i>
      <i className="icn icn--downlod"></i>
    </div>
  </header>
)