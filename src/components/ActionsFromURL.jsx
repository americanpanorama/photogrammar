import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Counties from '../../data/svgs/counties.json';
import { parsePathname } from '../helpers.js';

const ActionsFromURL = ({ setState }) => {
  const [pathLoaded, setPathLoaded] = useState(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const pathPieces = pathname
      .replace(`${process.env.PUBLIC_URL}`, '')
      .split('/')
      .filter(param => param);

    // get the view
    const getViz = (idx) => {
      const paramMap = {
        photographers: 'photographers',
        ohsearch: 'photographers',
        themes: 'themes',
        timeline: 'timeline',
        city: 'map',
        county: 'map',
        state: 'map',
        maps: 'map',
      }
      // look for the first match
      if (paramMap[pathPieces[idx]]) {
        return paramMap[pathPieces[idx]];
      } else if (idx < pathPieces.length - 1) {
        return getViz(idx + 1);
      } else {
        // return 'map' if there aren't any matches
        return 'map';
      }
    };
    const selectedViz = getViz(0);

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
        timeRange: (timeline) ? timeline.split('-') : [193501, 194406],
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
