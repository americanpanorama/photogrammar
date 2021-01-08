import * as React from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';
import { Props } from './Navbar.d';

const Navbar = ({ countiesLink, citiesLink, themesLink, selectedViz, selectedMapView, toggleSearch, isMobile }: Props) => {
  const location = useLocation();
  const { pathname } = location;
  return (
    <nav className="navbar">
      <ul className="nav navbar-nav navbar-right">
        <li
          onClick={toggleSearch}
        >
          Search
        </li>
        <li className={(selectedViz === 'photographers' && pathname !== '/about') ? 'active photographerslink' : 'photographerslink'}>
          <Link to='/photographers'>
            Photographers
          </Link>
        </li>
        <li className={(selectedViz === 'themes' && pathname !== '/about') ? 'active themes' : 'themes'}>
          <Link to={themesLink}>Themes</Link>
        </li>
        <li className={(selectedViz === 'map' && selectedMapView === 'counties' && pathname !== '/about') ? 'active counties' : 'counties'}>
          <Link to={countiesLink}>
            {`${(!isMobile) ? 'Map: ' : ''}Counties`}
          </Link>
        </li>
        <li className={(selectedViz === 'map' && selectedMapView === 'cities' && pathname !== '/about') ? 'active cities' : 'cities'}>
          <Link to={citiesLink}>
            {`${(!isMobile) ? 'Map: ' : ''}Cities & Towns`}
          </Link>
        </li>
        {(isMobile) ? (
          <li className={(selectedViz === 'timeline') ? 'active timeline' : 'timeline'}>
            <Link to={'/timeline'}>
              Timeline
            </Link>
          </li>
        ) : (
          <React.Fragment>
            <li className={(pathname === '/about') ? 'active': ''}><Link to='/about'>About</Link></li>
            <li><a href="https://dsl.richmond.edu/panorama#maps" className="section-scroll" target='_blank'>American Panorama</a></li>
          </React.Fragment>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
