
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ selectedViz, selectedMapView, selectMapView }) => {
  return (
    <nav className="navbar">
      <ul className="nav navbar-nav navbar-right">
        <li><a href="#about" className="section-scroll">Photographers</a></li>
        <li className={(selectedViz === 'themes') ? 'active themes' : 'themes'}>
          <Link to={`/themes`}>Themes</Link>
        </li>
        <li className={(selectedViz === 'map' && selectedMapView === 'counties') ? 'active counties' : 'counties'}>
          {(selectedViz === 'map' && selectedMapView !== 'counties') ? (
            <span 
              onClick={selectMapView}
              id='counties'
            >
              Map: Counties
            </span>
          ) : (
            <Link to={`/maps`}>
              Map: Counties
            </Link>
          )}
        </li>
        <li className={(selectedViz === 'map' && selectedMapView === 'cities') ? 'active cities' : 'cities'}>
          {(selectedViz === 'map' && selectedMapView !== 'cities') ? (
            <span 
              onClick={selectMapView}
              id='cities'
            >
              Map: Cities & Towns
            </span>
          ) : (
            <Link to={`/maps#mapview=cities`}>
              Map: Cities & Towns
            </Link>
          )}
        </li>
        <li><a href="#projects" className="section-scroll">About</a></li>
        <li><a href="https://dsl.richmond.edu/panorama#maps" className="section-scroll" target='_blank'>American Panorama</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;

Navbar.propTypes = {
  selectedViz: PropTypes.string.isRequired,
  selectedMapView: PropTypes.string.isRequired,
  selectMapView: PropTypes.func.isRequired,
};

Navbar.defaultProps = {

};
