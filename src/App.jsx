import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import FetchSidebarPhotos from './components/sidebar/FetchSidebarPhotos.js';
import FetchPhotoCount from './components/sidebar/FetchPhotoCount.js';
import Map from './components/Map.js';
import Stats from './components/Stats.js';
import Photo from './components/Photo.js';
import TimelineHeatmap from './components/TimelineHeatmap.js';
import TimelineSlider from './components/TimelineSlider.js';

const App = ({ initializeData }) => {
  initializeData();

  return (
    <Router>
      <div className='wrapper'>
        <nav className="navbar navbar-custom navbar-transparent navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#custom-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="index.html">
                <li>Photogrammar</li>
              </a>
              <hr className="divider" />
            </div>
          
            <div className="collapse navbar-collapse" id="custom-collapse">     
              <ul className="nav navbar-nav navbar-right">
                <li><a href="#hero" className="section-scroll">Search</a></li>
                <li><a href="#about" className="section-scroll">Photographers</a></li>
                <li><a href="#news" className="section-scroll">Themes</a></li>
                <li>
                  <Link to={`${process.env.PUBLIC_URL}/maps`}>Maps</Link>
                </li>
                <li><a href="#latest-maps" className="section-scroll">Labs</a></li>
                <li><a href="#projects" className="section-scroll">About</a></li>
              </ul>
            </div>
          </div>
        </nav>

        <div id="sidebar">
          <FetchPhotoCount />
          <FetchSidebarPhotos />
        </div>

        <div id="viz-canvas">
          <Switch>
            <Route path={`${process.env.PUBLIC_URL}/photo/:id`}>
              <Photo />
            </Route>
            <Route path={[`${process.env.PUBLIC_URL}/county/:placeId`, `${process.env.PUBLIC_URL}/state/:placeId`, `${process.env.PUBLIC_URL}/`]}>
              <Stats />
              <Map />
              <TimelineHeatmap />
              <TimelineSlider />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
