import React, { useState, useEffect, useRef, Fragment } from 'react';
import Async from "react-async";
import Select from 'react-select';
import PropTypes from 'prop-types';

const fetchSelectable = async ({ fetchPath }, { signal }) => {
  const response = await fetch(fetchPath, { signal });
  if (!response.ok) { console.warn(`themes select query failed: ${response}`)}
  return response.json();
};

const SearchSelect = ({ label, defaultValue, onChange, fetchPath, styles, allOptions, filterFunction }) => {
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

  if (!fetchPath) {
    return (
      <React.Fragment>
        <h4>{label}</h4>

        <Select
          options={allOptions}
          defaultValue={defaultValue}
          isClearable
          onChange={onChange}
          //ref={themesRef}
          className='dropdown'
          // placeholder={placeholder}
          styles={customStyles}
        />
      </React.Fragment>
    );
  }

  return (
    <Async
      promiseFn={fetchSelectable}
      fetchPath={fetchPath}
      watch={fetchPath}
    >
      {({ data, error, isPending }) => {
        if (isPending) {
          return (
            <React.Fragment>
              <h4>{label}</h4>
              <div>loading options ...</div>
            </React.Fragment>
          );
        }
        if (error) return `Something went wrong: ${error.message}`;
        if (data) {
          const options = allOptions.filter(filterFunction(data.rows));

          return (
            <React.Fragment>
              <h4>{label}</h4>

              <Select
                options={options}
                defaultValue={defaultValue}
                isClearable
                onChange={onChange}
                className='dropdown'
                // placeholder={placeholder}
                styles={customStyles}
              />
            </React.Fragment>
          );
        }
      }}

    </Async>
  );
};

export default SearchSelect;

SearchSelect.propTypes = {
};

SearchSelect.defaultProps = {
  
};
