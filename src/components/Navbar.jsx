import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ selectedViz, selectedMapView, selectedCity, selectedCounty, selectedState, toggleSearch, isMobile }) => {
  let countiesLink = (selectedCity || selectedState) ? `/state/${selectedState}` :'/maps';
  let citiesLink = (selectedCounty || selectedState) ? `/state/${selectedState}#mapview=cities` : '/maps#mapview=cities';

  return (
    <nav className="navbar">
      <ul className="nav navbar-nav navbar-right">
        <li
          onClick={toggleSearch}
        >
          Search
        </li>
        <li className={(selectedViz === 'photographers') ? 'active photographerslink' : 'photographerslink'}>
          <Link to='/photographers'>
            Photographers
          </Link>
        </li>
        <li className={(selectedViz === 'themes') ? 'active themes' : 'themes'}>
          <Link to={'/themes'}>Themes</Link>
        </li>
        <li className={(selectedViz === 'map' && selectedMapView === 'counties') ? 'active counties' : 'counties'}>
          <Link to={countiesLink}>
            {`${(!isMobile) ? 'Map: ' : ''}Counties`}
          </Link>
        </li>
        <li className={(selectedViz === 'map' && selectedMapView === 'cities') ? 'active cities' : 'cities'}>
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
            <li><a href="#projects" className="section-scroll">About</a></li>
            <li><a href="https://dsl.richmond.edu/panorama#maps" className="section-scroll" target='_blank'>American Panorama</a></li>
          </React.Fragment>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

Navbar.propTypes = {
  selectedViz: PropTypes.string.isRequired,
  selectedMapView: PropTypes.string.isRequired,
};

Navbar.defaultProps = {

};
