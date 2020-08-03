import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Counties from '../../data/svgs/counties.json';
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
    const selectedViz = getViz() || 'map';

    // remove the basename from the pathPieces and build an object with state parameters
    const stateParams = parsePathname(pathname.replace(`${process.env.PUBLIC_URL}`, ''));
    const selectedMapView = (stateParams.city || hash === '#mapview=cities') ? 'cities' : 'counties';

    const {
      ohsearch,
      themes: selectedTheme,
      timeline,
      city: selectedCity,
      county: selectedCounty,
      photo: selectedPhoto,
      photographers: selectedPhotographer,
      caption,
    } = stateParams;

    // set the state from city or county if necessary;
    let selectedState = stateParams.state;
    if (selectedCounty) {
      ({ s: selectedState } = Counties.find(c => c.j === selectedCounty));
    } else if (selectedCity) {
      selectedState = selectedCity.substring(0, 2);
    } 

    if (`${pathname}${hash}` !== pathLoaded) {
      setState({
        selectedPhotographer: selectedPhotographer || null,
        selectedPhoto: selectedPhoto || null,
        selectedState: selectedState || null,
        selectedCounty: selectedCounty || null,
        selectedCity: selectedCity || null,
        selectedTheme: selectedTheme || 'root',
        selectedViz: selectedViz,
        selectedMapView: selectedMapView,
        filterTerms: (caption) ? caption.match(/(".*?"|[^",\s]+)(?=\s*|\s*$)/g) || [] : [],
        pathname,
        hash,
      });
      setPathLoaded(`${pathname}${hash}`); 
    }
  });

  return null;
};

export default ActionsFromURL;

ActionsFromURL.propTypes = {
  setState: PropTypes.func.isRequired,
};
