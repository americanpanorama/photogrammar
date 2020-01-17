import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Link, useParams, useLocation } from "react-router-dom";
import './Map.css';

const Map = ({ counties, states, selectedCounty, translateX, translateY, scale, setXYZ, selectCounty, mapDimensions }) => {
  const projection = d3.geoAlbersUsa()
    .translate([mapDimensions.width /2, mapDimensions.height /2]);
  const path = d3.geoPath(projection); 

  const { placeId } = useParams();
  const location = useLocation();
  const mapView = (location.pathname.split('/').length > 1 && ["state", "county"].includes(location.pathname.split('/')[1]))
    ? location.pathname.split('/')[1] : 'national';

  if (mapView === 'county' && placeId !== selectedCounty) {
    selectCounty(placeId);
  }

  let geometry = {type: "Feature", properties: {}, geometry: {type: "Polygon", coordinates: [[[-124.98046874999999, 24.607069137709683 ], [-66.357421875, 24.607069137709683 ], [-66.357421875, 49.32512199104001 ], [-124.98046874999999, 49.32512199104001 ], [-124.98046874999999, 24.607069137709683 ] ] ] } };
  let properties;
  let linkUp;
  if (mapView === 'state') {
    ({ geometry } = states.find(st => st.properties.abbr === placeId));
    linkUp = '/';
  } else if (mapView === 'county') {
    ({ geometry, properties } = counties.find(c => c.properties.nhgis_join === placeId));
    linkUp = `/state/${properties.stateAbbr}`;
  }

  const gutter = 0.9;
  const gbounds = path.bounds(geometry);
  const center = [(gbounds[0][0] + gbounds[1][0]) / 2, (gbounds[0][1] + gbounds[1][1]) / 2];
  const dx = Math.abs(gbounds[1][0] - gbounds[0][0]);
  const dy = Math.abs(gbounds[1][1] - gbounds[0][1]);
  const calculatedScale = gutter / Math.max(dx / mapDimensions.width, dy / mapDimensions.height);
  const x = mapDimensions.width / 2 - calculatedScale * center[0];
  const y = mapDimensions.height / 2 - calculatedScale * center[1];

  const ref = useRef(null);
  const stateRefs = {};
  states.forEach(st => {
    stateRefs[st.properties.abbr] = useRef(null);
  });
  const filteredCounties = counties
    .filter(c => c.properties.nhgis_join && c.properties.nhgis_join !== 'NULL'
      && (mapView !== 'state' || c.properties.stateAbbr === placeId));
  const countyRefs = {};
  counties.forEach(c => {
    countyRefs[c.properties.nhgis_join] = useRef(null);
  });

  useEffect(
    () => {
      d3.select(ref.current)
        .transition()
        .duration(750)
        .attr("transform", `translate(${translateX} ${translateY}) scale(${scale})`);
      states
        .map(st => st.properties.abbr)
        .forEach(abbr => {
          d3.select(stateRefs[abbr].current)
            .transition()
            .duration(750)
            .style("stroke-width", 0.7 / scale);
        });
      filteredCounties
        .map(c => c.properties.nhgis_join)
        .forEach(nhgisJoin => {
          d3.select(countyRefs[nhgisJoin].current)
            .transition()
            .duration(750)
            .style("stroke-width", 0.25 / scale);
        });
    }
  );

  // zoom to the state or county if necessary
  if (translateX !== x || translateY !== y || scale !== calculatedScale) {
    setXYZ(x, y, calculatedScale);
  }

  const onStateHover = (e) => {
    const stateAbbr = e.currentTarget.id;
    Object.keys(stateRefs)
      .forEach(abbr => {
        const fillOpacity = (abbr === stateAbbr) ? 0 : 0.7;
        const strokeWidth = (abbr === stateAbbr) ? 3 / scale : 0.7 / scale;
        d3.select(stateRefs[abbr].current)
          .style("fill-opacity", fillOpacity)
          .style("stroke-width", strokeWidth);
      });
  };

  const onStateOut = (e) => {
    Object.keys(stateRefs)
      .forEach(abbr => {
        d3.select(stateRefs[abbr].current)
          .style("fill-opacity", 0)
          .style("stroke-width", 0.7 / scale);
      });
  };

  const onCountyHover = (e) => {
    const currentNhgisJoin = e.currentTarget.id;
    filteredCounties
      .map(c => c.properties.nhgis_join)
      .forEach(nhgisJoin => {
        const adjustedStroke = (nhgisJoin === currentNhgisJoin) ? 'black' : 'grey';
        const adjustedStrokeWidth = (nhgisJoin === currentNhgisJoin) ? 1 / scale : 0.25 / scale;

        d3.select(countyRefs[nhgisJoin].current)
          .style("stroke", adjustedStroke)
          .style("stroke-width", adjustedStrokeWidth);
      });
  };

  const onCountyOut = (e) => {
    filteredCounties
      .map(c => c.properties.nhgis_join)
      .forEach(nhgisJoin => {
        d3.select(countyRefs[nhgisJoin].current)
          .style("stroke", 'grey')
          .style("stroke-width", 0.25 / scale);
      });
  };

  return (
    <React.Fragment>
      <div
        className='mapControls'
        style={{
          width: 50,
          height: mapDimensions.height,
        }}
      >
        {(linkUp) && (
          <Link to={linkUp}>
            <button>
              {'<'}
            </button>
          </Link>
        )}
      </div>
      <svg
        width={mapDimensions.width}
        height={mapDimensions.height}
        className='map'
      >
        <g
          ref={ref}
        >
          {filteredCounties.map(c => {
            if (mapView === 'state' && c.properties.photoCount > 0) {
              return (
                <Link
                  to={`/county/${c.properties.nhgis_join}`}
                  key={c.properties.nhgis_join}
                >
                  <path
                    d={path(c.geometry)}
                    style={{
                      fill: c.properties.fill,
                      fillOpacity: c.properties.fillOpacity,
                      strokeWidth: 0.25,
                      stroke: 'black',
                      strokeOpacity: c.properties.strokeOpacity,
                    }}
                    ref={countyRefs[c.properties.nhgis_join]} 
                    id={c.properties.nhgis_join}
                    onMouseEnter={onCountyHover}
                    onMouseLeave={onCountyOut}
                  />
                </Link>
              );
            }
            return (
              <path
                d={path(c.geometry)}
                style={{
                  fill: c.properties.fill,
                  fillOpacity: c.properties.fillOpacity,
                  strokeWidth: 0.25,
                  stroke: 'black',
                  strokeOpacity: c.properties.strokeOpacity,
                }}
                className='unselectable'
                key={c.properties.nhgis_join}
                ref={countyRefs[c.properties.nhgis_join]} 
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
                    ref={stateRefs[st.properties.abbr]}
                    id={st.properties.abbr}
                    style={{
                      fill: 'white',
                      fillOpacity: 0,
                      strokeWidth: 0.7 / scale,
                    }}
                    onMouseEnter={onStateHover}
                    onMouseLeave={onStateOut}
                  />
                </Link>
              );
            }
            return (
              <path
                d={path(st.geometry)}
                className='stateBoundary unselectable'
                style={{
                  fill: 'white',
                  fillOpacity: 0,
                  strokeWidth: 0.7 / scale,
                }}
                ref={stateRefs[st.properties.abbr]}
                key={st.properties.name}
              />
            );
          })}
        </g>
      </svg>
    </React.Fragment>
  );
};

export default Map;

Map.propTypes = {
  counties: PropTypes.array.isRequired,
  states: PropTypes.array.isRequired,
  selectCounty: PropTypes.func,
  scale: PropTypes.number.isRequired,
  mapDimensions: PropTypes.object.isRequired,
};

Map.defaultProps = {
  
};
