export const Header = () => (
  <header className="header">
    <nav className="nav">
      {/* <a className="is-active" href="/results" >Table</a> */}
      <a href="/results" >Table</a>
      <a href="/results/bar" >Bar</a>
      <a href="/results/graph" >Graph</a>
      <a href="/results/line" >Line</a>
      <a href="/results/bubble" >Bubble</a>
      <a href="/results/map" >Map</a>
    </nav>
    <div className="tools">
      <i className="icn icn--save"></i>
      <i className="icn icn--voice"></i>
      <i className="icn icn--downlod"></i>
    </div>
  </header>
)