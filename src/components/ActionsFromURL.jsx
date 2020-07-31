import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { parsePathname } from '../helpers.js';

const ActionsFromURL = ({ setState }) => {
  const [pathLoaded, setPathLoaded] = useState(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const firstPathPiece = pathname
      .replace(`${process.env.PUBLIC_URL}`, '')
      .split('/')
      .filter(param => param)[0];
    // get the view
    const getViz = () => ({
      photographers: 'photographer',
      ohsearch: 'photographer',
      themes: 'themes',
      timeline: 'timeline',
      city: 'map',
      county: 'map',
      state: 'map',
      maps: 'map',
      photo: 'photo',
    }[firstPathPiece]);
    const urlViz = getViz() || 'map';

    // remove the basename from the pathPieces and build an object with state parameters
    const stateParams = parsePathname(pathname.replace(`${process.env.PUBLIC_URL}`, ''));
    //console.log(pathLoaded, stateParams);
    const mapView = (stateParams.city || hash === '#mapview=cities') ? 'cities' : 'counties';

    if (`${pathname}${hash}` !== pathLoaded) {
      setState(stateParams, urlViz, mapView);
      setPathLoaded(`${pathname}${hash}`); 
    }
  });

  return null;
};

export default ActionsFromURL;

ActionsFromURL.propTypes = {

};

ActionsFromURL.defaultProps = {
  
};
