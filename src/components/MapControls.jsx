import React from 'react';
import PropTypes from 'prop-types';
import './MapControls.css';

const CityCountyToggle = ({ selectedMapView, selectMapView, show }) => {
  if (!show) {
    return null;
  }
  return (
    <ul id='cityCountyToggle'>
      <li
        onClick={selectMapView}
        id={(selectedMapView === 'counties') ? 'cities' : 'counties'}
      >
        {(selectedMapView === 'counties') ? 'cities' : 'counties'}
      </li>
    </ul>
  );
};

export default CityCountyToggle;

CityCountyToggle.propTypes = {
  selectedMapView: PropTypes.string.isRequired,
  selectMapView: PropTypes.func.isRequired,
};

CityCountyToggle.defaultProps = {
  
};
