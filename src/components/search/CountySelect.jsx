import React, { useState, useEffect, useRef, Fragment } from 'react';
import Async from "react-async";
import Select from 'react-select';
import PropTypes from 'prop-types';

const fetchSelectableStates = async ({ fetchPath }, { signal }) => {
  const response = await fetch(fetchPath, { signal });
  if (!response.ok) { console.warn(`themes select query failed: ${response}`)}
  return response.json();
};

const CountySelect = ({ defaultValue, onChange, fetchPath, styles, states }) => {
  if (!fetchPath) {
    return (
      <React.Fragment>
        <h4>State</h4>

        <Select
          options={states}
          defaultValue={defaultValue}
          isClearable
          onChange={onChange}
          //ref={themesRef}
          className='dropdown'
          // placeholder={placeholder}
          // styles={customStyles}
        />
      </React.Fragment>
    );
  }

  return (
    <Async
      promiseFn={fetchSelectableStates}
      fetchPath={fetchPath}
      watch={fetchPath}
    >
      {({ data, error, isPending }) => {
        if (isPending) return "Loading...";
        if (error) return `Something went wrong: ${error.message}`;
        if (data) {
          console.log(data);
          const options = states.filter(d => data.rows.map(p => p.state).includes(d.label));

          return (
            <React.Fragment>
              <h4>State</h4>

              <Select
                options={options}
                defaultValue={defaultValue}
                isClearable
                onChange={onChange}
                className='dropdown'
                // placeholder={placeholder}
                // styles={customStyles}
              />
            </React.Fragment>
          );
        }
      }}

    </Async>
  );
};

export default CountySelect;

CountySelect.propTypes = {
};

CountySelect.defaultProps = {
  
};
