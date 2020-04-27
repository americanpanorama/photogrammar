import React, { useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar.js';
import Filter from './components/Filter.js';
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

const App = ({ selectedViz, selectedMapView, className, dimensions, selectMapView, isInitialized, initializeData, windowResized }) => {

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
      <div
        className={`wrapper ${className}`}
      >
      <header className="navbar-header">
          <Link to={`/`}>
            Photogrammar
          </Link>
        </header>
        <Navbar />


        <div id="sidebar">
          <Welcome />
          <Filter />
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
