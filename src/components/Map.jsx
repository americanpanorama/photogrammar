import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams, useLocation } from "react-router-dom";
import * as d3 from 'd3';
import County from './County.jsx';
import State from './State.jsx';
import City from './City.jsx';
import MapLabel from './MapLabel.jsx';
import States from '../../data/svgs/states.json';
import { buildLink } from '../helpers.js';
import './Map.css';

const Map = (props) => {
  const {
    counties,
    cities,
    selectedCounty,
    selectedCity,
    selectedState,
    mapParameters,
    selectedMapView,
    isSearching,
  } = props;

  const ref = useRef(null);
  const isMounting = useRef(true);
  const [ hoveredCounty, setHoveredCounty ] = useState(null);
  const [ hoveredCity, setHoveredCity ] = useState(null);
  // const [ hoveredState, setHoveredState ] = useState(null);
  const [ translateX, setTranslateX ] = useState(mapParameters.translateX);
  const [ translateY, setTranslateY ] = useState(mapParameters.translateY);
  const [ scale, setScale ] = useState(mapParameters.scale);
  const { placeId } = useParams();
  const { pathname } = useLocation();

  useEffect(
    () => {
      console.log('map called');
      d3.select(ref.current)
        .transition()
        .duration((isMounting.current) ? 0 : 1000)
        .attr('transform', `translate(${mapParameters.translateX} ${mapParameters.translateY}) scale(${mapParameters.scale})`)
        .on('end', () => {
          setTranslateX(mapParameters.translateX);
          setTranslateY(mapParameters.translateY);
          setScale(mapParameters.scale);
          isMounting.current = false;
        });
    }, [mapParameters.x, mapParameters.y, mapParameters.scale]
  );

  let linkUp;
  if (selectedCity || selectedCounty) {
    linkUp = buildLink({
      replace: [{
        param: (selectedCity) ? 'city' : 'county',
        withParam: 'state',
        value: selectedState,
      }], 
    });
  } else if (selectedState) {
    linkUp = buildLink({ remove: ['state'] });
  }

  // check to see if it's the city view or county view and set if necessary

  // set selected place from url if necessary
  const mapScale = (pathname.split('/').length > 1
    && ['state', 'county', 'city'].includes(pathname.split('/')[1]))
    ? pathname.split('/')[1] : 'national';
  let cityDivisor = (mapScale !== 'national') ? 3 : 6;
  // calculate the divisor based on the number of photos
  if (isSearching && cities.length > 0) {
    // what's the max 
    const maxCount = Math.max(...cities.map(c => c.total));
    cityDivisor = (mapScale !== 'national') ? maxCount / 200 : maxCount / 100;
  }


  const mapLabelParams = {};
  if (selectedCity) {
    const selectedCityMetadata = cities.find(c => c.key === selectedCity);
    if (selectedCityMetadata) {
      mapLabelParams.label = selectedCityMetadata.city;
      mapLabelParams.x = selectedCityMetadata.center[0];
      mapLabelParams.y = selectedCityMetadata.center[1] - Math.sqrt(selectedCityMetadata.total / (cityDivisor * mapParameters.scale)) - 5 / mapParameters.scale;
    }
  } else if (selectedCounty) {
    const selectedCountyMetadata = counties.find(c => c.nhgis_join === selectedCounty);
    if (selectedCountyMetadata) {
      mapLabelParams.label = selectedCountyMetadata.name;
      mapLabelParams.x = selectedCountyMetadata.labelCoords[0]
      mapLabelParams.y = selectedCountyMetadata.labelCoords[1]
    }
  }

  //const selectedCityMetadata = (selectedCity) ? cities.find(c => c.key === selectedCity) : null;




  const onCityHover = (cityKey) => {
    // find the city
    const hoveredCity = cities.find(city => cityKey === city.key);
    setHoveredCity(hoveredCity);
  };

  const onCityUnhover = () => {
    setHoveredCity(null);
  };

  const onCountyHover = (nhgis_join) => {
    // find the city
    if (nhgis_join !== selectedCounty) {
      const hoveredCounty = counties.find(counties => nhgis_join === counties.nhgis_join);
      // only hover if it has photos
      if (hoveredCounty.photoCount > 0) {
        setHoveredCounty(hoveredCounty);
      }
    }
  };

  const onCountyUnhover = () => {
    setHoveredCounty(null);
  };

  return (
    <React.Fragment>
      <div
        className='mapControls'
      >
        {(linkUp) && (
          <Link to={linkUp}>
            <button>
              <svg
                width={25}
                height={25}
              >
                <g transform='translate(9 12.5)'>
                  <line
                    x1={0}
                    x2={8}
                    y1={0}
                    y2={-5}
                    stroke='black'
                    strokeWidth={2}
                  />
                  <line
                    x1={0}
                    x2={8}
                    y1={0}
                    y2={5}
                    stroke='black'
                    strokeWidth={2}
                  />
                </g>
              </svg>
            </button>
          </Link>
        )}
      </div>
      <svg
        width={mapParameters.width}
        height={mapParameters.height}
        className='map'
        id='map'
      >
        <g
          transform={`translate(${translateX} ${translateY}) scale(${scale})`}
          ref={ref}
        >
          {counties.map(c => (
            <County
              {...c}
              scale={mapParameters.scale}
              selectedCounty={selectedCounty}
              strokeWidth={(mapScale === 'national') ?  0 : 0.75 / mapParameters.scale}
              linkActive={mapScale !== 'national' && c.photoCount > 0}
              key={c.nhgis_join}
              onCountyHover={onCountyHover}
              onCountyUnhover={onCountyUnhover}
            />
          ))}
          { cities.map(city => {
            if (city.center && city.center[0]) {
              const { key } = city;
              let fillOpacity = 0.33;
              let stroke='#289261';
              if (hoveredCity || selectedCity) {
                if ((hoveredCity && key === hoveredCity.key )|| key === selectedCity) {
                  fillOpacity = 0.9;
                } else {
                  fillOpacity = 0.2;
                  stroke='transparent';
                }
              }
              return (
                <City
                  cx={city.center[0]}
                  cy={city.center[1]}
                  r={Math.sqrt(city.total / (cityDivisor * mapParameters.scale))}
                  fillOpacity={fillOpacity}
                  stroke={stroke}
                  strokeWidth={0.5 / mapParameters.scale}
                  scale={scale}
                  name={city.city}
                  id={city.key}
                  key={city.key}
                  linkActive={mapScale !== 'national'}
                  onCityHover={onCityHover}
                  onCityUnhover={onCityUnhover}
                />
              );
            }
          })}
          {States.filter(s => s.bounds && s.bounds[0] && s.d && s.abbr).map(state => {
            const stateLink = buildLink({
              replace: [
                {
                  param: 'maps',
                  withParam: 'state',
                  value: state.abbr,
                },
                {
                  param: 'state',
                  value: state.abbr,
                },
                {
                  param: 'county',
                  withParam: 'state',
                  value: state.abbr,
                }
              ],
            });
            return (
              <State
                {...state}
                //fillOpacity={(hoveredState && state.abbr !== hoveredState.abbr) ? 0.4 : 0}
                fillOpacity={0}
                link={stateLink}
                linkActive={(mapScale === 'national' || (selectedState !== state.abbr))}
                scale={mapParameters.scale}
                // onHover={onStateHover}
                // onUnhover={onStateUnhover}
                key={state.abbr}
              />
            );
          })}

          {(hoveredCity) && (
            <MapLabel 
              x={hoveredCity.center[0]}
              y={hoveredCity.center[1] - Math.sqrt(hoveredCity.total / (cityDivisor * mapParameters.scale)) - 5 / mapParameters.scale}
              fontSize={12 / scale}
              label={hoveredCity.city}
            />
          )}

          {(hoveredCounty) && (
            <MapLabel 
              x={hoveredCounty.labelCoords[0]}
              y={hoveredCounty.labelCoords[1]}
              fontSize={16 / mapParameters.scale}
              label={hoveredCounty.name}
            />
          )}


          {(mapLabelParams.label) && (
            <MapLabel 
              x={mapLabelParams.x}
              y={mapLabelParams.y}
              fontSize={16 / mapParameters.scale}
              label={mapLabelParams.label}
            />
          )}
        </g>
      </svg>
    </React.Fragment>
  );
};

export default React.memo(Map);

Map.propTypes = {
  counties: PropTypes.array.isRequired,
  selectCounty: PropTypes.func,
};

Map.defaultProps = {
  
};
