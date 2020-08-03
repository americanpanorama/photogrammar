import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import Select from 'react-select';
import CreatableSelect, { makeCreatableSelect } from 'react-select/creatable';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import * as d3 from 'd3';
import themes from '../../data/themes.json';
import CloseButton from './buttons/Close.jsx';
import './Search.css';

const Search = (props) => {
  const {
    selectedPhotographer,
    selectedCounty,
    selectedCity,
    selectedState,
    selectedTheme,
    terms,
    selectedMapView,
    search,
    photographers,
    states,
    countiesOrCities,
    cities,
    timeRange,
    caption,
    toggleSearch,
    open,
  } = props;
  const [theState, setTheState] = useState(selectedState);
  const [statesOptions, setStatesOptions] = useState(states);
  const [countiesOrCitiesOptions, setCountiesOrCitiesOptions] = useState([]);
  const [photographerOptions, setPhotographerOptions] = useState(photographers);
  const [themesOptions, setThemesOptions] = useState(themes);
  const [timeRangeOptions, setTimeRangeOptions] = useState(timeRange);
  const [photoCaptionOptions, setPhotoCaptionOptions] = useState([]);
  const [linkTo, setLinkTo] = useState('/');

  const formRef = useRef();
  const photographersRef = useRef();
  const statesRef = useRef(selectedState);
  const countiesOrCitiesRef = useRef();
  const themesRef = useRef();
  const timeRef = useRef();
  const filterTermsRef = useRef();

  const getFormOptions = () => {
    let caption;
    if (filterTermsRef.current.state && filterTermsRef.current.state.inputValue) {
      caption = filterTermsRef.current.state.inputValue;
    } else if (filterTermsRef.current.props.value && filterTermsRef.current.props.value.value) {
      caption = filterTermsRef.current.props.value.value;
    }
    return {
      photographerOption: photographersRef.current.state.value,
      stateOption: statesRef.current.state.value,
      countyOrCityOption: countiesOrCitiesRef.current.state.value,
      themeOption: themesRef.current.state.value,
      captionOption: caption,
      timeRangeOption: timeRef.current.state.bounds.map(anX => {
        const dateNum = x.invert(anX);
        const rawMonth = numToMonth(dateNum % 1);
        const year = (rawMonth === 13) ? Math.floor(dateNum) + 1 : Math.floor(dateNum);
        const month = (rawMonth === 13) ? 1 : rawMonth;
        return year * 100 + month;
      }),
    };
  };


  useEffect(() => {
    if (!open) {
      return;
    }

    let path = '';

    const { photographerOption, stateOption, countyOrCityOption, themeOption, captionOption: caption, timeRangeOption } = getFormOptions(); 
    
    const photographer = photographerOption && photographerOption.value;
    const state = stateOption && stateOption.value;
    const cityOrCounty = countyOrCityOption && countyOrCityOption.value;
    const theme = themeOption && themeOption.value;

    if (cityOrCounty) {
      path = `/${(selectedMapView === 'cities') ? 'city' : 'county'}/${cityOrCounty}`;
    } else if (state) {
      path = `/state/${state}`;
    } else {
      path = `/maps`;
    }
    if (photographer) {
      path = `${path}/photographers/${photographer}`;
    }
    if (theme) {
      path = `${path}/themes/${theme}`
    }
    if (caption) {
      path = `${path}/caption/${caption}`
    }

    if (path !== linkTo) {
      console.log(path)
      setLinkTo(path);
    }
  })

  if (!open) {
    return null;
  }

  const monthNum = m => (m - 1) / 12;
  const numToMonth = num => Math.round(num * 12) + 1;
  const x = d3.scaleLinear()
    .domain([1935, 1944 + monthNum(6)])
    .range([0, 100]);
  const marks = {};
  [1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944].forEach(y => {
    marks[x(y)] = {
      label: y
    };
  });
  const step = x(1935 + monthNum(2)) - x(1935);

  const defaultValue = [
    x(Math.floor(timeRangeOptions[0] / 100) + monthNum(timeRangeOptions[0] % 100)),
    x(Math.floor(timeRangeOptions[1] / 100) + monthNum(timeRangeOptions[1] % 100)),
  ];

  const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';

  const getTimeSliderValues = () => {
    return timeRef.current.state.bounds.map(anX => {
      const dateNum = x.invert(anX);
      const rawMonth = numToMonth(dateNum % 1);
      const year = (rawMonth === 13) ? Math.floor(dateNum) + 1 : Math.floor(dateNum);
      const month = (rawMonth === 13) ? 1 : rawMonth;
      return year * 100 + month;
    });
  }

  const fetchSelectable = async (field) => {
    const wheres = [];

    const { photographerOption, stateOption, countyOrCityOption, themeOption, captionOption, timeRangeOption } = getFormOptions(); 
    if (field !== 'photographer_name' && photographerOption && photographerOption.label) {
      wheres.push(`photographer_name = '${photographerOption.label}'`);
    }
    if (!field !== 'state' && stateOption && stateOption.label) {
      wheres.push(`state = '${stateOption.label}'`);
    }
    if (!field !== 'nhgis_join' && selectedMapView === 'counties' && countyOrCityOption && countyOrCityOption.value) {
      wheres.push(`nhgis_join = '${countyOrCityOption.value}'`);
    }
    if (!field !== 'city' && selectedMapView === 'cities' && countyOrCityOption && countyOrCityOption.label) {
      wheres.push(`city = '${countyOrCityOption.label}'`);
    }
    if (!field !== 'theme' && themeOption && themeOption.value) {
      const levels = themeOption.value.replace('root|', '').split('|')
      if (levels.length === 3) {
        wheres.push(`vanderbilt_level3 = '${levels[2]}'`);
      }
      if (levels.length >= 2) {
        wheres.push(`vanderbilt_level2 = '${levels[1]}'`);
      }
      if (levels.length >= 1) {
        wheres.push(`vanderbilt_level1 = '${levels[0]}'`);
      } 
    }
    if (field === 'theme') {
      wheres.push('vanderbilt_level1 is not null');
    }
    if (field !== 'time') {
      const [startTime, endTime] = timeRangeOption;
      if (startTime > 193501) {
        const startYear = Math.floor(startTime / 100);
        const startMonth = startTime % 100;
        wheres.push(`(year > ${startYear} or (year = ${startYear} and month >= ${startMonth}))`);
      }
      if (endTime < 194406) {
        const endYear = Math.floor(endTime / 100);
        const endMonth = endTime % 100;
        wheres.push(`(year < ${endYear} or (year = ${endYear} and month <= ${endMonth}))`);
      }
    }
    // the value of the filter term can be in a few places from the creatable component
    if (captionOption && captionOption.value) {
      const terms = captionOption.value.split(' ').filter(t => t);
      terms.forEach(filterTerm => {
         wheres.push(`caption ~* '\\m${filterTerm}'`);
      });
    }

    if (wheres.length > 0) {
      const query = (field !== 'themes')
        ? `select distinct ${field} from photogrammar_photos where ${wheres.join(' and ')}`
        : `select distinct concat(case when vanderbilt_level1 is not null then concat('root|', vanderbilt_level1) else '' end, case when vanderbilt_level2 is not null then concat('|', vanderbilt_level2) else '' end,  case when vanderbilt_level3 is not null then concat ('|', vanderbilt_level3) else '' end) as themes from photogrammar_photos where ${wheres.join(' and ')}`;
      console.log(query);
      const response = await fetch(`${cartoURLBase}${encodeURIComponent(query)}`);
      const json = await response.json();
      return json.rows.map(d => d[field]);
    } else {
      if (field === "photographer_name") {
        return photographers;
      }
      if (field === 'state') {
        return states;
      }
      if (field === 'nhgis_join') {
        return [];
      }
      if (field === 'theme') {
        return themes;
      }
    }
  };

  const setPhotographers = async () => {
    const selectable = await fetchSelectable('photographer_name');
    setPhotographerOptions(photographers.filter(option => selectable.includes(option.label)));
  };

  const setStates = async () => {
    const selectable = await fetchSelectable('state');
    setStatesOptions(states.filter(option => selectable.includes(option.label)));
  };

  const setCountiesOrCities = async () => {
    const selectable = (selectedMapView === 'cities')
      ? await fetchSelectable('city')
      : await fetchSelectable('nhgis_join');
    const stateAbbr = statesRef.current.state.value.value;
    const options = (selectedMapView === 'cities')
      ? countiesOrCities.cities[stateAbbr]
        .filter(option => selectable.includes(option.label))
        .sort((a, b) => (a.label > b.label) -1 : 1)
      : countiesOrCities.counties[stateAbbr].filter(option => selectable.includes(option.value))

    setCountiesOrCitiesOptions(options);
  };

  const setThemes = async () => {
    const selectable = await fetchSelectable('themes');
    setThemesOptions(themes.filter(option => selectable.includes(option.value)));
  };

  const updateLink = () => {
    let path = '';

    const { photographerOption, stateOption, countyOrCityOption, themeOption, captionOption: caption, timeRangeOption } = getFormOptions(); 
    
    const photographer = photographerOption && photographerOption.value;
    const state = stateOption && stateOption.value;
    const cityOrCounty = countyOrCityOption && countyOrCityOption.value;
    const theme = themeOption && themeOption.value;

    console.log(photographer, state, cityOrCounty, theme, caption);

    if (cityOrCounty) {
      path = `/${(selectedMapView === 'cities') ? 'city' : 'county'}/${cityOrCounty}`;
    } else if (state) {
      path = `/state/${state}`;
    } else {
      path = `/maps`;
    }
    if (photographer) {
      path = `${path}/photographers/${photographer}`;
    }
    if (theme) {
      path = `${path}/themes/${theme}`
    }
    if (caption) {
      path = `${path}/caption/${caption}`
    }

    console.log(path)
    setLinkTo(path);
    //window.location.href = `${process.env.PUBLIC_URL}${path}`;
  };

  const handleStateChange = (e) => {
    setTheState(e.value);
  };

  const onPhotographerChange = (inputValue, action) => {
    // set the value using the input as there seems to be a delay before the component updates it
    if (action.action === 'select-option') {
      photographersRef.current.state.value = inputValue;
    } else if (action.action === 'clear') {
      photographersRef.current.state.value = null;
    }
    setStates(inputValue.label);
    if (statesRef.current.state && statesRef.current.state.value) {
      setCountiesOrCities(inputValue.label, inputValue.value);
    }
    setThemes();
  };


  const onStateChange = (inputValue, action) => {
    // set the value using the input as there seems to be a delay before the component updates it
    if (action.action === 'select-option') {
      statesRef.current.state.value = inputValue;
    } else if (action.action === 'clear') {
      statesRef.current.state.value = null;
    }
    setPhotographers();
    setCountiesOrCities();
    setThemes();
  };

  const onCountyOrCityChange = (inputValue, action) => {
    // set the value using the input as there seems to be a delay before the component updates it
    if (action.action === 'select-option') {
      countiesOrCitiesRef.current.state.value = inputValue;
    } else if (action.action === 'clear') {
      countiesOrCitiesRef.current.state.value = null;
    }
    setPhotographers();
    setThemes();
  };

  const onThemeChange = (inputValue, action) => {
    // set the value using the input as there seems to be a delay before the component updates it
    if (action.action === 'select-option') {
      themesRef.current.state.value = inputValue;
    } else if (action.action === 'clear') {
      themesRef.current.state.value = null;
    }
    setPhotographers();
    setStates();
    if (statesRef.current.state && statesRef.current.state.value) {
      setCountiesOrCities();
    }
  }

  const onTimeChanging = (xs) => {
    const newTimeRange = (xs.map(anX => {
      const dateNum = x.invert(anX);
      const rawMonth = numToMonth(dateNum % 1);
      const year = (rawMonth === 13) ? Math.floor(dateNum) + 1 : Math.floor(dateNum);
      const month = (rawMonth === 13) ? 1 : rawMonth;
      return year * 100 + month;
    }));
    setTimeRangeOptions(newTimeRange);
  };

  const onTimeChange = () => {
    setPhotographers();
    setStates();
    if (statesRef.current.state && statesRef.current.state.value) {
      setCountiesOrCities();
    }
    setThemes();
  };

  const onFilterChange = (value) => {
    setPhotographers();
    setStates();
    if (statesRef.current.state && statesRef.current.state.value) {
      setCountiesOrCities();
    }
    setThemes();
  }

  const defaultPhotographerIdx = (selectedPhotographer) ? photographers.findIndex(p => p.value === selectedPhotographer) : null;

  const placeholder = 'select or search ...';

  const customStyles = {
    control: (provided, state) => {
      return {
      ...provided,
      borderRadius: '19px',
      borderColor: (state.isFocused) ? '#297373' : 'grey',
      backgroundColor: (state.isFocused) ? 'white' : '#fafafa',
      //boxShadow: (state.isFocused) ? 'px 2px 2px 2px #297373' : 'none',
      boxShadow: state.isFocused ? "0 0 0 2px #297373" : 0,
      '&:hover': {
        borderColor: 'pink'
      }
    }},
  }

  const inputStyles = {
    control: (provided, state) => {
      return {
      ...provided,
      borderRadius: '19px',
      borderColor: (state.isFocused) ? '#297373' : 'grey',
      backgroundColor: (state.isFocused) ? 'white' : '#fafafa',
      //boxShadow: (state.isFocused) ? 'px 2px 2px 2px #297373' : 'none',
      boxShadow: state.isFocused ? "0 0 0 2px #297373" : 0,
      '&:hover': {
        borderColor: 'pink'
      }
    }},
    indicatorsContainer: (provided, state) => {
      return {
        display: 'none',
      }
    }
  }

  return (
    <div
      id='searchWrapper'
    >
      <div
        id='advancedSearch'
      >
        <div className='controls'>
          <CloseButton
            onClick={toggleSearch}
            role='close'
          />
        </div>

        <h2>Search</h2>

        <h4>Photographer</h4>
        <Select
          options={photographerOptions}
          ref={photographersRef}
          isClearable
          isSearchable
          name='photographers'
          onChange={onPhotographerChange}
          //defaultInputValue={(selectedPhotographer) ? photographers.find(p => p.value === selectedPhotographer).label : 'no default'}
          defaultValue={(defaultPhotographerIdx) ? photographerOptions[defaultPhotographerIdx] : ''}
          className='dropdown'
          placeholder={placeholder}
          styles={customStyles}
        />

        <h4>Location</h4>

        <Select
          defaultValue={(selectedState) ? statesOptions.find(s => s.value === selectedState) : null}
          options={statesOptions}
          isClearable
          onChange={onStateChange}
          ref={statesRef}
          className='dropdown'
          placeholder='select or search state ...'
          styles={customStyles}
        />

        <Select
          options={countiesOrCitiesOptions}
          isClearable
          isDisabled={countiesOrCitiesOptions.length === 0}
          onChange={onCountyOrCityChange}
          ref={countiesOrCitiesRef}
          className='dropdown'
          placeholder={(countiesOrCitiesOptions.length > 0) ? `select or search ${(selectedMapView === 'cities') ? 'city' : 'county'} ...` : 'select state above'}
          styles={customStyles}
        />

        <h4>Themes</h4>

        <Select
          options={themesOptions}
          isClearable
          onChange={onThemeChange}
          ref={themesRef}
          className='dropdown'
          placeholder={placeholder}
          styles={customStyles}
        />


        <h4>Photo Caption</h4>

        <CreatableSelect
          styles={customStyles}
          //onChange={onFilterChange}
          onCreateOption={(inputValue) => {
            console.log(inputValue);
            setPhotoCaptionOptions([
              {
                label: inputValue,
                value: inputValue,
              },
              ...photoCaptionOptions,
            ]);
            onFilterChange();
          }}
          formatCreateLabel={(inputValue) => `search captions for "${inputValue}"`}
          createOptionPosition='last'
          //menuIsOpen={false}
          ref={filterTermsRef}
          //placeholder={captionInput}
          value={photoCaptionOptions[0]}
          options={photoCaptionOptions}
        />

        <h4>Time Range</h4>

        <div
          className='timelineSlider'
          style={{
            width: '90%',
            marginLeft: '5%',
          }}
        >
          <Range
            allowCross={false}
            value={defaultValue}
            onChange={onTimeChanging} 
            marks={marks}
            step={step}
            trackStyle={[{
              backgroundColor: 'black',
            }]}
            handleStyle={[
              {
                borderColor: 'black',
                backgroundColor: 'yellow',
              },
              {
                borderColor: 'black',
                backgroundColor: 'yellow',
              },
            ]} 
            activeDotStyle={{
              borderColor: 'black',
            }}
            ref={timeRef}
            onAfterChange={onTimeChange}
          />
        </div>

        <Link
          to={linkTo}
        >
          <button>
            submit
          </button>
        </Link>

      </div>
    </div>
  );
};

export default Search;

Search.propTypes = {
  selectedPhotographer: PropTypes.string,
  selectedCounty: PropTypes.string,
  selectedCity: PropTypes.string,
  selectedState: PropTypes.string,
  selectedTheme: PropTypes.string,
  search: PropTypes.func,
  photographers: PropTypes.array,
  states: PropTypes.array,
  counties: PropTypes.object,
  cities: PropTypes.array,
  themes: PropTypes.array,
  timeRange: PropTypes.array,
  caption: PropTypes.string,
};

Search.defaultProps = {

};
