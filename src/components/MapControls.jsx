import React from 'react';
import PropTypes from 'prop-types';
import './MapControls.css';

const MapControls = ({ selectedMapView, selectMapView }) => {
  return (
    <ul id='mapControls'>
      <li
        onClick={selectMapView}
        id={(selectedMapView === 'counties') ? 'cities' : 'counties'}
      >
        {(selectedMapView === 'counties') ? 'cities' : 'counties'}
      </li>
    </ul>
  );
};

export default MapControls;

MapControls.propTypes = {
  selectedMapView: PropTypes.string.isRequired,
  selectMapView: PropTypes.func.isRequired,
};

MapControls.defaultProps = {
  
};
