import React from 'react';
import PropTypes from 'prop-types';
import './ToggleViz.css';

const ToggleViz = ({ selectedViz, toggleViz, vizOpen }) => {
  return (
    <div
      onClick={toggleViz}
      id='vizToggle'
    >
      {(vizOpen) ? `↓ collapse ${selectedViz} ↓` : `↑ expand ${selectedViz} ↑`}
    </div>
  );
};

export default ToggleViz;

ToggleViz.propTypes = {
  toggleViz: PropTypes.func.isRequired,
  vizOpen: PropTypes.bool.isRequired,
};

ToggleViz.defaultProps = {

};
