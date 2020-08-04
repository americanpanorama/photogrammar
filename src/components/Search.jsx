import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import Select from 'react-select';
import CreatableSelect, { makeCreatableSelect } from 'react-select/creatable';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import * as d3 from 'd3';
import PhotographersSelect from './search/PhotographersSelect.js';
import StateSelect from './search/StateSelect.js';
import SearchSelect from './search/SearchSelect.jsx';
import ThemesSelect from './search/ThemesSelect.js';
import themes from '../../data/themes.json';
import CloseButton from './buttons/Close.jsx';
import './Search.css';

const Search = (props) => {
  const {
    selectedPhotographerOption,
    selectedStateOption,
    selectedThemeOption,
    selectedCountyOption,
    selectedCityOption,
    terms,
    selectedMapView,
    search,
    countiesOrCitiesOptions,
    cities,
    timeRange,
    caption,
    toggleSearch,
  } = props;

  const [timeRangeOptions, setTimeRangeOptions] = useState(timeRange);
  const [photoCaptionOptions, setPhotoCaptionOptions] = useState([]);
  const [linkTo, setLinkTo] = useState('/');

  const [photographerOption, setPhotographerOption] = useState(selectedPhotographerOption);
  const [stateOption, setStateOption] = useState(selectedStateOption);
  const [countyOrCityOption, setCountyOrCityOption] = useState(selectedCountyOption || selectedCityOption);
  const [themeOption, setThemeOption] = useState(selectedThemeOption);

  const formRef = useRef();
  const timeRef = useRef();
  const filterTermsRef = useRef();

  const getFormOptions = () => {
    let caption;
    // if (filterTermsRef.current.state && filterTermsRef.current.state.inputValue) {
    //   caption = filterTermsRef.current.state.inputValue;
    // } else if (filterTermsRef.current.props.value && filterTermsRef.current.props.value.value) {
    //   caption = filterTermsRef.current.props.value.value;
    // }
    return {
      photographerOption,
      stateOption,
      countyOrCityOption: null,
      themeOption,
      captionOption: caption,
      timeRangeOption: [193501, 194406]
    };
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
    let path = '';

    const { countyOrCityOption, captionOption: caption, timeRangeOption } = getFormOptions(); 
    
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

  

  const getTimeSliderValues = () => {
    return timeRef.current.state.bounds.map(anX => {
      const dateNum = x.invert(anX);
      const rawMonth = numToMonth(dateNum % 1);
      const year = (rawMonth === 13) ? Math.floor(dateNum) + 1 : Math.floor(dateNum);
      const month = (rawMonth === 13) ? 1 : rawMonth;
      return year * 100 + month;
    });
  }

  const makeQuery = (field) => {
    const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    const wheres = [];

    const { captionOption, timeRangeOption } = getFormOptions(); 
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
    if (wheres.length > 0 && field === 'theme') {
      wheres.push('vanderbilt_level1 is not null');
    }

    if (wheres.length > 0) {
      const query = (field !== 'themes')
        ? `select distinct ${field} from photogrammar_photos where ${wheres.join(' and ')}`
        : `select distinct concat(case when vanderbilt_level1 is not null then concat('root|', vanderbilt_level1) else '' end, case when vanderbilt_level2 is not null then concat('|', vanderbilt_level2) else '' end,  case when vanderbilt_level3 is not null then concat ('|', vanderbilt_level3) else '' end) as themes from photogrammar_photos where ${wheres.join(' and ')}`;
      return `${cartoURLBase}${encodeURIComponent(query)}`;
    } 

    return null;
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

  const onCountyOrCityChange = (inputValue, action) => {
    // set the value using the input as there seems to be a delay before the component updates it
    if (action.action === 'select-option') {
      countiesOrCitiesRef.current.state.value = inputValue;
    } else if (action.action === 'clear') {
      countiesOrCitiesRef.current.state.value = null;
    }
  };

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
    if (statesRef.current.state && statesRef.current.state.value) {
      setCountiesOrCities();
    }
  };

  const onFilterChange = (value) => {
    setStates();
    if (statesRef.current.state && statesRef.current.state.value) {
      setCountiesOrCities();
    }
  }

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

        <PhotographersSelect
          fetchPath={makeQuery('photographer_name')}
          defaultValue={photographerOption}
          onChange={(inputValue, action) => { setPhotographerOption(inputValue); }}
          filterFunction={rows => d => rows.map(p => p.photographer_name).includes(d.label)}
          label='Photographer'
        />

        <StateSelect
          fetchPathState={makeQuery('state')}
          defaultValue={stateOption}
          onChange={(inputValue, action) => { setStateOption(inputValue); }}
          filterFunction={rows => d => rows.map(p => p.state).includes(d.label)}
          label='State'
        />

        {(selectedMapView === 'counties' && stateOption) && (
          <SearchSelect
            fetchPathState={makeQuery('nhgis_join')}
            defaultValue={countyOrCityOption}
            onChange={(inputValue, action) => { setCountyOrCityOption(inputValue); }}
            filterFunction={rows => d => rows.map(p => p.nhgis_join).includes(d.value)}
            label='County'
            allOptions={countiesOrCitiesOptions.counties[stateOption.value]}
          />
        )}

        {(selectedMapView === 'counties' && !stateOption) && (
          <React.Fragment>
            <h4>County</h4>
            <div>Select state above</div>
          </React.Fragment>
        )}

        <ThemesSelect
          fetchPath={makeQuery('themes')}
          defaultValue={themeOption}
          onChange={(inputValue, action) => { setThemeOption(inputValue); }}
          filterFunction={rows => d => rows.map(p => p.themes).includes(d.value)}
          label='Theme'
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
  selectedCounty: PropTypes.string,
  selectedCity: PropTypes.string,
  selectedState: PropTypes.string,
  search: PropTypes.func,
  states: PropTypes.array,
  counties: PropTypes.object,
  cities: PropTypes.array,
  themes: PropTypes.array,
  timeRange: PropTypes.array,
  caption: PropTypes.string,
};

Search.defaultProps = {

};
