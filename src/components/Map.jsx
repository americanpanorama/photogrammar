import React, { useEffect, useRef, useState } from 'react';
import Async from "react-async";
import PropTypes from 'prop-types';
import { Link, useParams, useLocation } from "react-router-dom";
import * as d3 from 'd3';
import { getStateAbbr } from '../helpers.js';
import Counties from '../../data/svgs/counties.json';
import Cities from '../../data/citiesCounts.json';
import Centroids from '../../data/centroids.json';
import County from './County.jsx';
import State from './State.jsx';
import City from './City.jsx';
import MapLabel from './MapLabel.jsx';
import States from '../../data/svgs/states.json';
import './Map.css';

const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};

const loadCountiesAndCities = async ({ fetchPath }, { signal }) => {
  const res = await fetch(fetchPath, { signal });
  if (!res.ok) { console.log(res) }
  return res.json();
}

const getCentroidForCounty = (nhgis_join) => Centroids.counties[nhgis_join];

const getCentroidForCity = cityKey => Centroids.cities[cityKey];

const formatCounties = (data, timeRange, filterTerms, selectedState) => {
  // if the data comes from carto you need to do a bit of reformatting
  let countiesData = {};
  if (data.rows) {
    const { rows } = data;
    rows.forEach(county => {
      countiesData[county.nhgis_join] = {
        total: county.total,
      };
    });
  } else {
    countiesData = data.counties;
  }

  return Counties
    .filter(county => {
      const { j: nhgis_join, s: state } = county;
      if (state === 'AK') {
      }
      if (!nhgis_join || nhgis_join === 'NULL') {
        return false;
      }
      if (selectedState && state !== selectedState) {
        return false;
      }
      if (county.d.includes('-35,221.3542')) {
        return false;
      }
      return true;
    })
    .map(county => {
      const { j: nhgis_join, a: area_sqmi, s: state, n: name, d, l: labelCoords } = county;
      let photoCount;
      const [startTime, endTime] = timeRange;
      if (!countiesData[nhgis_join]) {
        photoCount = 0;
      } else if (countiesData[nhgis_join].total) {
        photoCount = countiesData[nhgis_join].total;
      } else if (filterTerms.length === 0 && (startTime > 193501 || endTime < 194504)) {
        // Only run this conditional logic if there isn't filter terms
        // If there is, the query to carto filters by time and returns `total`
        photoCount = Object
          .keys(countiesData[nhgis_join])
          .filter(k => {
            if (k === 'total' || k === 'photographers') {
              return false;
            }
            return k.substring(1) >= startTime && k.substring(1) <= endTime;
          })
          .reduce((accumulator, k) => {
            return countiesData[nhgis_join][k] + accumulator;
          }, 0);
      } 
      const fill = (photoCount > 0) ? '#6a1b9a' : 'white'; //'#eceff1';
      const fillOpacity = (photoCount > 0) ? Math.min(1, photoCount * 50 / area_sqmi + 0.1) : 0.75;
      const centroidData = getCentroidForCounty(nhgis_join);
      // TO DO: everything should have centroids so this check shouldn't be necessary
      const { center } = (centroidData) ? centroidData : { center: [0, 0] };
      const strokeOpacity = (photoCount > 0) ? 1 : 0;
      return {
        d,
        name,
        state,
        nhgis_join,
        area_sqmi,
        fill,
        fillOpacity,
        strokeOpacity,
        photoCount,
        center,
        labelCoords,
      };
    });
};

const formatCities = (data, timeRange, filterTerms, selectedState) => {
  // if the data comes from carto you need to do a bit of reformatting/organization
  let citiesData = {};
  if (data.rows) {
    const { rows } = data;
    rows.forEach(city => {
      const abbrIdx = Object.values(stateabbrs).indexOf(city.state);
      if (abbrIdx !== -1) {
        const abbr = Object.keys(stateabbrs)[abbrIdx];
        citiesData[`${abbr}_${city.city}`] = {
          total: city.total,
        };
      }
    })
  } else {
    citiesData = data.cities;
  }
  if (Object.keys(citiesData).length === 0) {
    return [];
  }
  return Cities
    .filter(cd => {
      if (selectedState && getStateAbbr(cd.s) !== selectedState) {
        return false;
      }
      return true;
    })
    .map(cd => {
      const { k: key, c: city, s: state } = cd;
      let total;
      const [startTime, endTime] = timeRange;
      if (!citiesData[key]) {
        total = 0;
      } else if (filterTerms.length === 0 && (startTime > 193501 || endTime < 193504)) {
        // Only run this conditional logic if there isn't filter terms
        // If there is, the query to carto filters by time and returns `total`
        total = Object
          .keys(citiesData[key])
          .filter(k => {
            if (k === 'total' || k === 'photographers') {
              return false;
            }
            return parseInt(k.substring(1)) >= startTime && parseInt(k.substring(1)) <= endTime;
          })
          .reduce((accumulator, k) => {
            return citiesData[key][k] + accumulator;
          }, 0);
      } else {
        total = citiesData[key].total;
      }
      return {
        key,
        total,
        city,
        state,
        center: Centroids.cities[key],
      }
    });
};

const Map = (props) => {
  const {
    cities,
    selectedCounty,
    selectedCity,
    selectedState,
    mapParameters,
    selectedMapView,
    isSearching,
    selectedPhotographer,
    timeRange,
    filterTerms,
    fetchPath,
    buildLink,
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
  // TODO
  // calculate the divisor based on the number of photos
  // if (isSearching && cities.length > 0) {
  //   // what's the max 
  //   const maxCount = Math.max(...cities.map(c => c.total));
  //   cityDivisor = (mapScale !== 'national') ? maxCount / 200 : maxCount / 100;
  // }


  const mapLabelParams = {};
  if (selectedCity) {
    const selectedCityMetadata = Cities.find(c => c.k === selectedCity);
    if (selectedCityMetadata) {
      selectedCityMetadata.center = getCentroidForCity(selectedCity);
      mapLabelParams.label = selectedCityMetadata.city;
      mapLabelParams.x = selectedCityMetadata.center[0];
      mapLabelParams.y = selectedCityMetadata.center[1] - Math.sqrt(selectedCityMetadata.total / (cityDivisor * mapParameters.scale)) - 5 / mapParameters.scale;
    }
  } else if (selectedCounty) {
    const selectedCountyMetadata = Counties.find(c => c.j === selectedCounty);
    if (selectedCountyMetadata) {
      mapLabelParams.label = selectedCountyMetadata.n;
      mapLabelParams.x = selectedCountyMetadata.l[0]
      mapLabelParams.y = selectedCountyMetadata.l[1]
    }
  }

  //const selectedCityMetadata = (selectedCity) ? cities.find(c => c.key === selectedCity) : null;

  const onCityHover = (cityKey) => {
    // find the city
    const hoveredCity = Cities.find(city => cityKey === city.k);
    if (hoveredCity) {
      hoveredCity.center = getCentroidForCity(cityKey);
    }
    console.log(hoveredCity);
    setHoveredCity(hoveredCity);
  };

  const onCityUnhover = () => {
    setHoveredCity(null);
  };

  const onCountyHover = (nhgis_join) => {
    // find the city
    if (nhgis_join !== selectedCounty) {
      const hoveredCounty = Counties.find(county => nhgis_join === county.j);
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
          <Async
            promiseFn={loadCountiesAndCities}
            fetchPath={fetchPath}
            watch={fetchPath}
          >
            {({ data, error, isPending }) => {
              //if (isPending) return "Loading..."
              if (error) return `Something went wrong: ${error.message}`
              if (data) {
                // format the counties
                if (selectedMapView === 'counties') {
                  console.log(data);
                  const counties = formatCounties(data, timeRange, filterTerms, selectedState);
                  return (
                    <React.Fragment>
                      {counties.map(c => (
                        <County
                          {...c}
                          scale={mapParameters.scale}
                          selectedCounty={selectedCounty}
                          strokeWidth={(mapScale === 'national') ?  0 : 0.75 / mapParameters.scale}
                          linkActive={mapScale !== 'national' && c.photoCount > 0}
                          buildLink={buildLink}
                          key={c.nhgis_join}
                          onCountyHover={onCountyHover}
                          onCountyUnhover={onCountyUnhover}
                        />
                      ))}
                    </React.Fragment>
                  );
                } else {
                  const cities = formatCities(data, timeRange, filterTerms, selectedState);
                  return (
                    <React.Fragment>
                      { cities.map(city => {
                        if (city.center && city.center[0]) {
                          const { key } = city;
                          let fillOpacity = 0.33;
                          let stroke='#289261';
                          if (hoveredCity || selectedCity) {
                            if ((hoveredCity && key === hoveredCity.k) || key === selectedCity) {
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
                    </React.Fragment>
                  );
                }
                
              }
              return null;
            }}
          </Async>

 
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

          {(hoveredCity && hoveredCity.center) && (
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

};

Map.defaultProps = {
  
};
