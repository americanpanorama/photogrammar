import React, { useEffect, useRef } from 'react';
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
import TimelineHeatmap from './components/Timeline.js';
import TimelineSlider from './components/TimelineSlider.js';
import Treemap from './components/Treemap.js';

const App = ({ selectedViz, dimensions, isInitialized, initializeData, windowResized }) => {

  useEffect(() => {
    window.addEventListener('resize', windowResized);
    initializeData();
  }, []);

  if (!isInitialized) {
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
            <li><a href="#about" className="section-scroll">Photographers</a></li>
            <li className={(selectedViz === 'themes') ? 'active' : ''}>
              <Link to={`/themes`}>Themes</Link>
            </li>
            <li className={(selectedViz === 'map') ? 'active' : ''}>
              <Link to={`/maps`}>Maps</Link>
            </li>
            <li><a href="#latest-maps" className="section-scroll">Labs</a></li>
            <li><a href="#projects" className="section-scroll">About</a></li>
            <li><a href="https://dsl.richmond.edu/panorama#maps" className="section-scroll" target='_blank'>American Panorama</a></li>
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
            <Route path={['/themes/:themeKey', '/themes']}>
              <Treemap />
              <TimelineHeatmap />
              <TimelineSlider />
            </Route>
            <Route path={['/city/:placeId', `/county/:placeId`, `/city/:placeId`, `/state/:placeId`, `/`]}>
              <Map />
              <MapControls />
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
