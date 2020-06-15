import React, { useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import ActionsFromURL from './components/ActionsFromURL.js';
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
import Photographers from './components/Photographers.js';
import Photographer from './components/Photographer.js';
import RoyStryker from './components/RoyStryker.js';
import AikenAndWool from './components/AikenAndWool.js';
import CBBaldwin from './components/CBBaldwin.js';
import Lightbox from './components/Lightbox.js';

const App = ({ className, isInitialized, initializeData, windowResized, vizOpen, isMobile }) => {
  useEffect(() => {
    window.addEventListener('resize', windowResized);
    initializeData();
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div
        className={`wrapper ${className}`}
      >
        <ActionsFromURL />
        <header className="navbar-header">
          <Link to={'/'}>
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} />
          </Link>
        </header>
        <Navbar />
        <div id="viz-canvas">
          <Switch>
            <Route path={'/photo/:id+'}>
              <Photo />
            </Route>
            <Route path={'/photographers/RoyStryker'}>
              <RoyStryker />
            </Route>
            <Route path={'/photographers/AikenAndWool'}>
              <AikenAndWool />
            </Route>
            <Route path={'/photographers/CBBaldwin'}>
              <CBBaldwin />
            </Route>
            <Route path={'/photographers/:photographerKey'}>
              <Photographer />
            </Route>
            <Route path={'/photographers/'}>
              <Photographers />
            </Route>
            <Route path={['/themes/:themeKey', '/themes']}>
              <Treemap />
              {(!isMobile) && (
                <React.Fragment>
                  <TimelineHeatmap />
                  <TimelineSlider />
                </React.Fragment>
              )}
            </Route>
            <Route path={['/timeline']}>
              {(isMobile) && (
                <React.Fragment>
                  <TimelineHeatmap />
                  <TimelineSlider />
                </React.Fragment>
              )}
            </Route>
            <Route path={['/city/:placeId', '/county/:placeId', '/city/:placeId', '/state/:placeId', '/']}>
              <Map />
              {(!isMobile) && (
                <React.Fragment>
                  <TimelineHeatmap />
                  <TimelineSlider />
                </React.Fragment>
              )}
            </Route>
          </Switch>
        </div>

        <Welcome />
        <Filter />
        <FetchPhotoCount />
        <FetchSidebarPhotos />

      </div>
      <Lightbox />
    </Router>
  );
}

export default App;
