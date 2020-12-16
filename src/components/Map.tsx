import React, { useEffect, useRef, useState } from 'react';
import Async from "react-async";
import { Link, useParams, useLocation } from "react-router-dom";
import * as d3 from 'd3';
// @ts-ignore
import us from 'us';
import Counties from '../../data/svgs/counties.json';
import States from '../../data/svgs/states.json';
import Cities from '../../data/citiesCounts.json';
import Centroids from '../../data/centroids.json';
import County from './County';
import State from './State';
import City from './City';
import MapLabel from './MapLabel';
import './Map.css';
import {
  MapLabelProps,
  MonthTotal,
  PlaceCountData,
  VisibleCity,
  CityMetadata,
  StyledCity,
  MapParameters,
  ProjectedCounty,
  StyledCounty,
  ProjectedState,
  Centroid,
  CityKey,
  NHGISJoinCode,
  StateAbbr,
} from '../index.d';

interface Props {
  selectedCounty: NHGISJoinCode | null;
  selectedCity: CityKey | null;
  selectedState: StateAbbr | null;
  selectedPhotographer: string | null;
  timeRange: [number, number];
  filterTerms: string[];
  mapParameters: MapParameters;
  selectedMapView: string;
  isSearching: boolean;
  fetchPath: string;
  makeLink([]: { type: string, payload?: string}[]): string;
}

interface AsyncData {
  counties?: PlaceCountData[];
  cities?: PlaceCountData[];
  themes?: any;
}

interface CartoCountyRow {
  k: NHGISJoinCode;                 // nhgis_join
  t: number;                 // total photos
}

interface CartoCountyData {
  rows: CartoCountyRow[];
  fields: { k: number };
}

interface CartoCityRow {
  c: string;                 // city
  s: string;                 // state
  t: number;                 // total photos
}

interface CartoCityData {
  rows: CartoCityRow[];
  fields: { s: number };
}

const loadCountiesAndCities = async ({ fetchPath }: { fetchPath: string}) => {
  const res = await fetch(fetchPath);
  if (!res.ok) { console.log(res) }
  const rawData: AsyncData | CartoCountyData | CartoCityData = await res.json();
  const isCartoCountyData = (data: AsyncData | CartoCountyData | CartoCityData): data is CartoCountyData => (data as CartoCountyData).fields !== undefined && (data as CartoCountyData).fields.k !== undefined;
  const isCartoCityData = (data: AsyncData | CartoCountyData | CartoCityData): data is CartoCityData => (data as CartoCityData).fields !== undefined && (data as CartoCityData).fields.s !== undefined;
  // the local async data is already organized; if this is retrieved from carto (signaled by the `row` param) it needs to be organized
  if (isCartoCountyData(rawData)) {
    const counties: PlaceCountData[] = rawData.rows.map((county: CartoCountyRow): PlaceCountData => ({
      k: county.k,
      t: county.t,
    }));
    return { counties };
  }
  if (isCartoCityData(rawData)) {
    const cities: PlaceCountData[] = rawData.rows.map((city: CartoCityRow): PlaceCountData => ({
      k: `${us.lookup(city.s).abbr}_${city.c}`.replace(/[\s\.,]/g,'') as CityKey,
      t: city.t,
    }));
    return { cities };
  }

  return rawData;
}

const getCentroidForCity = (cityKey: CityKey): [number, number] => (Centroids.cities[cityKey]) ? Centroids.cities[cityKey] as [number, number] : [0, 0];

const Map = (props: Props) => {
  const {
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
    makeLink,
  } = props;

  const ref = useRef(null);
  const isMounting = useRef(true);
  const [ hoveredCounty, setHoveredCounty ] = useState(null);
  const [ hoveredCity, setHoveredCity ] = useState(null);
  // const [ hoveredState, setHoveredState ] = useState(null);
  const [ translateX, setTranslateX ] = useState(mapParameters.translateX);
  const [ translateY, setTranslateY ] = useState(mapParameters.translateY);
  const [ scale, setScale ] = useState(mapParameters.scale);
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
    }, [mapParameters]
  );

  let linkUp;
  if (selectedCity || selectedCounty) {
    linkUp = makeLink([{ type: 'clear_county' }, { type: 'clear_city'}]);
  } else if (selectedState) {
    linkUp = makeLink([{ type: 'clear_state' }]);
  }

  // check to see if it's the city view or county view and set if necessary

  // set selected place from url if necessary
  const mapScale = (pathname.split('/').length > 1
    && ['state', 'county', 'city'].includes(pathname.split('/')[1]))
    ? pathname.split('/')[1] : 'national';

  // if (isSearching && cities.length > 0) {
  //   // what's the max 
  //   const maxCount = Math.max(...cities.map(c => c.total));
  //   cityDivisor = (mapScale !== 'national') ? maxCount / 200 : maxCount / 100;
  // }

  const formatCounties = (data: PlaceCountData[]): StyledCounty[] => {
    const keysWithData = data.map(d => d.k);
    return (Counties as ProjectedCounty[])
      .filter(county => {
        const { j: nhgis_join, s: state } = county;
        if (!nhgis_join || nhgis_join === 'NULL') {
          return false;
        }
        if (selectedState && state !== selectedState) {
          return false;
        }
        if (county.d.includes('-35,221.3542')) {
          return false;
        }
        if (!keysWithData.includes(nhgis_join as NHGISJoinCode)) {
          return false;
        }
        return true;
      })
      .map((county) => {
        const [startTime, endTime] = timeRange;
        const countyData: PlaceCountData = data.find(d => d.k === county.j);
        let photoCount = 0;
        if (filterTerms.length === 0 && (startTime > 193501 || endTime < 193504) && countyData.ms) {
          photoCount = countyData.ms
            .filter((d: MonthTotal) => d.y * 100 + d.m >= startTime && d.y * 100 + d.m <= endTime)
            .reduce((accumulator, d: MonthTotal) => d.t + accumulator, 0);
        } else {
          photoCount = countyData.t;
        }
        const fill = (photoCount > 0) ? '#6a1b9a' : 'white'; //'#eceff1';
        const fillOpacity = (photoCount > 0) ? Math.min(1, photoCount * 50 / county.a + 0.1) : 0.75;
        if (isNaN(fillOpacity)) console.log(county);
        const strokeOpacity = (photoCount > 0) ? 1 : 0;
        return {
          d: county.d,
          name: county.n,
          state: county.s,
          nhgis_join: county.j,
          area_sqmi: county.a,
          fill,
          fillOpacity,
          strokeOpacity,
          photoCount,
          labelCoords: county.l,
        };
      });
  };

  // seems like this should return a STYLED CITY taking substantive data and turning it into svg data
  const formatCities = (data: PlaceCountData[]): StyledCity[] => {
    const keysWithData = data.map(d => d.k);
    const [startTime, endTime] = timeRange;
    // combine/calculate the photo county data with the city metadata
    const visibleCities = Cities
       // filter out other states if a state is selected
      .filter(cd => !(selectedState && us.lookup(cd.s).abbr !== selectedState) && keysWithData.includes(cd.k as CityKey))
      // get the count
      .map(city => {
        const cityData: PlaceCountData = data.find(d => d.k === city.k);
        let photoCount = 0;
        if (filterTerms.length === 0 && (startTime > 193501 || endTime < 193504) && cityData.ms) {
          photoCount = cityData.ms
            .filter((d: MonthTotal) => d.y * 100 + d.m >= startTime && d.y * 100 + d.m <= endTime)
            .reduce((accumulator, d: MonthTotal) => d.t + accumulator, 0);
        } else {
          photoCount = cityData.t;
        }
        return {
          c: city.c,
          k: city.k,
          t: photoCount,
          center: getCentroidForCity(cityData.k as CityKey) as [number, number],
        }
      })
      .filter(d => d.t > 0);

    // calculate the divisor based on the number of photos
    const totalCitiesPhotos = visibleCities.reduce((accumulator, city) => accumulator + city.t, 0);
    let cityDivisor = (mapScale !== 'national') ? 3 : 6;
    cityDivisor = cityDivisor * (totalCitiesPhotos / 40000 * mapParameters.scale);

    // style the data
    return visibleCities.map(d => {
      let fillOpacity = 0.33;
      let stroke='#289261';
      if (hoveredCity || selectedCity) {
        if ((hoveredCity && d.k === hoveredCity.k) || d.k === selectedCity) {
          fillOpacity = 0.9;
        } else {
          fillOpacity = 0.2;
          stroke='transparent';
        }
      }
      return {
        cx: d.center[0],
        cy: d.center[1],
        r: Math.sqrt(d.t / (cityDivisor * mapParameters.scale)),
        fillOpacity,
        stroke,
        strokeWidth: 0.5 / mapParameters.scale,
        name: d.c,
        id: d.k,          
      }
    });
  };


  const getMapLabelProps = (): MapLabelProps | null => {
    if (selectedCity) {
      const selectedCityMetadata: VisibleCity = Cities.find(c => c.k === selectedCity) as VisibleCity;
      // todo: this isn't scrolling
      if (selectedCityMetadata) {
        selectedCityMetadata.center = getCentroidForCity(selectedCity as CityKey);
        return {
          label: selectedCityMetadata.c.toString(),
          x: selectedCityMetadata.center[0],
          y: selectedCityMetadata.center[1],
        };
      }
    } else if (selectedCounty) {
      const selectedCountyMetadata: ProjectedCounty = Counties.find(c => c.j === selectedCounty) as ProjectedCounty;
      if (selectedCountyMetadata) {
        return {
          label: selectedCountyMetadata.n.toString(),
          x: selectedCountyMetadata.l[0],
          y: selectedCountyMetadata.l[1],
        };
      }
    }
    return null;
  }

  const mapLabelProps = getMapLabelProps();

  const onCityHover = (cityKey: string): void => {
    // find the city
    const hoveredCity: CityMetadata = Cities.find(city => cityKey === city.k) as CityMetadata;
    if (hoveredCity) {
      const [lat, lng] = getCentroidForCity(cityKey as CityKey);
      hoveredCity.lat = lat;
      hoveredCity.lng = lng; 
    }
    setHoveredCity(hoveredCity);
  };

  const onCityUnhover = (): void => {
    setHoveredCity(null);
  };

  const onCountyHover = (nhgis_join: string): void => {
    if (nhgis_join !== selectedCounty) {
      const hoveredCounty = Counties.find(county => nhgis_join === county.j);
      setHoveredCounty(hoveredCounty);
    }
  };

  const onCountyUnhover = (): void => {
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
                let cityDivisor = (mapScale !== 'national') ? 3 : 6;
                if (selectedMapView === 'counties') {
                  const counties = formatCounties(data.counties);
                  return (
                    <React.Fragment>
                      {counties.map(c => (
                        <County
                          {...c}
                          scale={mapParameters.scale}
                          strokeWidth={(mapScale === 'national') ?  0 : 0.75 / mapParameters.scale}
                          linkActive={mapScale !== 'national' && c.photoCount > 0}
                          makeLink={makeLink}
                          onCountyHover={onCountyHover}
                          onCountyUnhover={onCountyUnhover}
                          key={c.nhgis_join}
                        />
                      ))}
                      {(hoveredCounty) && (
                        <MapLabel 
                          x={hoveredCounty.l[0]}
                          y={hoveredCounty.l[1]}
                          fontSize={16 / mapParameters.scale}
                          label={hoveredCounty.n}
                        />
                      )}
                    </React.Fragment>
                  );
                } else {
                  const cities = formatCities(data.cities);
                  return (
                    <React.Fragment>
                      { cities.map(city => (
                        <City
                          {...city}
                          key={city.id}
                          linkActive={mapScale !== 'national'}
                          makeLink={makeLink}
                          onCityHover={onCityHover}
                          onCityUnhover={onCityUnhover}
                        />
                      ))}
                      {(hoveredCity && hoveredCity.center) && (
                        <MapLabel 
                          x={hoveredCity.center[0]}
                          y={hoveredCity.center[1] - Math.sqrt(hoveredCity.total / (cityDivisor * mapParameters.scale)) - 5 / mapParameters.scale}
                          fontSize={12 / scale}
                          label={hoveredCity.city}
                        />
                      )}
                    </React.Fragment>
                  );
                }
                
              }
              return null;
            }}
          </Async>

          {States
            .filter((s: ProjectedState) => s.bounds && s.bounds[0] && s.d && s.abbr)
            .map((state: ProjectedState) => {
              const stateLink = makeLink([
                {
                  type: 'set_state',
                  payload: state.abbr,
                },
                {
                  type: 'clear_county',
                },
                {
                  type: 'clear_city',
                },
              ]);
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
            })
          }

          {(mapLabelProps) && (
            <MapLabel 
              {...mapLabelProps}
              fontSize={16 / mapParameters.scale}
            />
          )}
        </g>
      </svg>
    </React.Fragment>
  );
};

export default React.memo(Map);
