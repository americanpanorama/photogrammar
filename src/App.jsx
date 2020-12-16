import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import ActionsFromURL from './components/ActionsFromURL.js';
import Navbar from './components/Navbar.js';
import SidebarPhotos from './components/sidebar/SidebarPhotos.js';
import SidebarHeader from './components/sidebar/SidebarHeader.js';
import Welcome from './components/Welcome.js';
import Map from './components/Map.js';
import Photo from './components/Photo.js';
import Lightbox from './components/Lightbox.js';
import TimelineHeatmap from './components/Timeline.js';
import TimelineSlider from './components/TimelineSlider.js';
import Treemap from './components/Treemap.js';
import Photographers from './components/Photographers.js';
import Photographer from './components/Photographer.js';
import OralHistoriesSearch from './components/OralHistoriesSearch.tsx';
import RoyStryker from './components/RoyStryker.js';
import AikenAndWool from './components/AikenAndWool.js';
import CBBaldwin from './components/CBBaldwin.js';
import Search from './components/Search.js';

const App = ({ className, isInitialized, initializeData, hasCompletedFirstLoad, windowResized, searchOpen, isMobile }) => {
  useEffect(() => {
    window.addEventListener('resize', windowResized);
    initializeData();
  }, []);

  if (!isInitialized) {
    return null;
  }

  // if (!hasCompletedFirstLoad) {
  //   return (
  //     <Router basename={process.env.PUBLIC_URL}>
  //       <ActionsFromURL />
  //     </Router>
  //   );
  // }

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

        {(hasCompletedFirstLoad) && (
          <React.Fragment>
              <div id="viz-canvas">
            <Switch>
                <Route
                  path='/'
                  exact
                >
                  <Redirect to='/maps' />
                </Route>
                <Route path={'/photo/:id+'}>
                  <Photo />
                </Route>
                <Route path={['/photographers/RoyStryker/:interviewKey/:timestampKey/:highlight', '/photographers/RoyStryker']}>
                  <RoyStryker />
                </Route>
                <Route path={['/photographers/AikenAndWool/:interviewKey/:timestampKey/:highlight', '/photographers/AikenAndWool/']}>
                  <AikenAndWool />
                </Route>
                <Route path={['/photographers/CBBaldwin/:interviewKey/:timestampKey/:highlight', '/photographers/CBBaldwin/']}>
                  <CBBaldwin />
                </Route>
                <Route path={['/photographers/:photographyKey/:interviewKey/:timestampKey/:highlight', '/photographers/:photographyKey/:interviewKey/:timestampKey', '/photographers/:photographerKey']}>
                  <Photographer />
                </Route>
                <Route path={'/photographers/'}>
                  <Photographers />
                </Route>
                <Route path={'/ohsearch/:searchFor'}>
                  <OralHistoriesSearch />
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
                <Route path={['/city/:placeId', '/county/:placeId', '/city/:placeId', '/state/:placeId', '/maps']}>
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
              <Switch>
              <Route path={'/lightbox'}>
                <Lightbox />
              </Route>
              </Switch>


            <Welcome />

            <SidebarHeader />
            <SidebarPhotos />
            
          </React.Fragment>
        )}
      </div>
      {(searchOpen) && <Search />}
      
    </Router>
  );
};

export default App;
