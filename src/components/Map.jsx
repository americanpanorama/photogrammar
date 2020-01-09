import React, { useState, useEffect, useRef }from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Link, useParams, useLocation } from "react-router-dom";
import './Map.css';

const Map = ({ counties, states, translateX, translateY, scale, selectCounty, setXYZFromBounds, dimensions }) => {
  const { placeId } = useParams();
  const location = useLocation();
  const mapView = (location.pathname.split('/').length > 1 && ["state", "county"].includes(location.pathname.split('/')[1]))
    ? location.pathname.split('/')[1] : 'national';

  const ref = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(placeId);

  const filteredCounties = counties
    .filter(c => c.properties.nhgis_join && c.properties.nhgis_join !== 'NULL'
      && (mapView !== 'state' || c.properties.stateAbbr === placeId));

  useEffect(
    () => {
      d3.select(ref.current)
        .transition()
        .duration(750)
        .attr("transform", `translate(${translateX} ${translateY}) scale(${scale})`);
        // .end(() => {
        //   setTop(style.top);
        //   setColor(style.color);
        //   setBackgroundColor(style.backgroundColor);
        // });
    }
  );

  const { map: mapDimensions } = dimensions;
  
  const projection = d3.geoAlbersUsa()
    .translate([mapDimensions.width /2, mapDimensions.height /2]);
  const path = d3.geoPath(projection); 

  // zoom to the state or county if necessary
  if (['state', 'county'].includes(mapView) && placeId !== selectedPlace) {
    const { geometry } = (mapView === 'state') ? states.find(st => st.properties.abbr === placeId)
      : counties.find(c => c.properties.nhgis_join === placeId);
    const gutter = (mapView === 'state') ? 0.9 : 0.7;
    setXYZFromBounds(path.bounds(geometry), gutter);
    setSelectedPlace(placeId);
  }

  return (
    <svg
      width={mapDimensions.width}
      height={mapDimensions.height}
      className='map'
    >
      <g
        ref={ref}
      >
        {filteredCounties.map(c => {
          if (mapView === 'state') {
            return (
              <Link
                to={`/county/${c.properties.nhgis_join}`}
                key={c.properties.nhgis_join}
              >
                <path
                  d={path(c.geometry)}
                  stroke='grey'
                  strokeWidth='0.25'
                  fill='purple'
                  fillOpacity={c.properties.fillOpacity}
                />
              </Link>
            );
          }
          return (
            <path
              d={path(c.geometry)}
              stroke='grey'
              strokeWidth='0.25'
              fill='purple'
              fillOpacity={c.properties.fillOpacity}
              className='unselectable'
              key={c.properties.nhgis_join}
            />
          );
        })}
        {states.map(st => {
          if (mapView === 'national' || (mapView === 'state' && st.properties.abbr !== placeId)) {
            return (
              <Link
                to={`/state/${st.properties.abbr}`}
                key={st.properties.name}
              >
                <path
                  d={path(st.geometry)}
                  className='stateBoundary'
                />
              </Link>
            );
          }
          return (
            <path
              d={path(st.geometry)}
              className='stateBoundary unselectable'
              key={st.properties.name}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default Map;

Map.propTypes = {
  counties: PropTypes.array.isRequired,
  states: PropTypes.array.isRequired,
  selectCounty: PropTypes.func,
  setXYZFromBounds: PropTypes.func.isRequired,
  scale: PropTypes.number.isRequired,
  dimensions: PropTypes.object.isRequired,
};

Map.defaultProps = {
  
};
