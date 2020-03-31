import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import FetchSidebarPhotos from './components/sidebar/FetchSidebarPhotos.js';
import FetchPhotoCount from './components/sidebar/FetchPhotoCount.js';
import Welcome from './components/Welcome.js';
import Map from './components/Map.js';
import MapControls from './components/MapControls.js';
import Stats from './components/Stats.js';
import Photo from './components/Photo.js';
import TimelineHeatmap from './components/TimelineHeatmap.js';
import TimelineSlider from './components/TimelineSlider.js';

const App = ({ dimensions, initializeData, windowResized }) => {
  useEffect(() => {
    window.addEventListener('resize', windowResized);
    initializeData();
  }, []);

  if (!dimensions.calculated) {
    return null;
  }

  //const basename = '/panorama/photogrammar';
  const basename = '';

  return (
    <Router basename={basename}>
      <div className='wrapper'>
      <header className="navbar-header">
          <Link to={`/`}>
            Photogrammar
          </Link>
          <hr className="divider" />
        </header>
        <nav className="navbar">
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#hero" className="section-scroll">Search</a></li>
            <li><a href="#about" className="section-scroll">Photographers</a></li>
            <li><a href="#news" className="section-scroll">Themes</a></li>
            <li>
              <Link to={`/maps`}>Maps</Link>
            </li>
            <li><a href="#latest-maps" className="section-scroll">Labs</a></li>
            <li><a href="#projects" className="section-scroll">About</a></li>
          </ul>
        </nav>

        <div id="sidebar">
          <Welcome />
          <FetchPhotoCount />
          <FetchSidebarPhotos />
        </div>

        <div id="viz-canvas">
          <Switch>
            <Route path={`/photo/:id`}>
              <Photo />
            </Route>
            <Route path={['/city/:placeId', `/county/:placeId`, `/city/:placeId`, `/state/:placeId`, `/`]}>
              <Stats />
              <MapControls />
              <Map />
              <TimelineHeatmap />
              <TimelineSlider />
            </Route>
            <Route>
              <div>not found</div>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
