import React, { useState, useEffect, useRef, Fragment } from 'react';
import Async from "react-async";
import Select, { OptionTypeBase } from 'react-select';
import { Props } from './SearchSelect.d';
import { Option, DBQueryResult } from '../Search.d';

const fetchSelectable = async ({ fetchPath }: { fetchPath: string }) => {
  const response = await fetch(fetchPath);
  if (!response.ok) { console.warn(`themes select query failed: ${response}`)}
  return await response.json();
};

const SearchSelect = ({ label, defaultValue, onChange, fetchPath, allOptions, altFilterFunction }: Props) => {
  const customStyles = {
    control: (provided: { [cssSelector: string ]: string; }, state: { isFocused: boolean; }) => {
      return {
      ...provided,
      borderRadius: '19px',
      borderColor: (state.isFocused) ? '#297373' : 'grey',
      backgroundColor: (state.isFocused) ? 'white' : '#fafafa',
      boxShadow: state.isFocused ? "0 0 0 2px #297373" : "0",
      '&:hover': {
        borderColor: 'pink'
      }
    }},
  };

  const filterFunction = (altFilterFunction) ? altFilterFunction : (rows: DBQueryResult[]) => (d: Option) => {
    return rows.map(p => p.field).includes(d.label) || rows.map(p => p.field).includes(d.value);
  };

  if (!fetchPath) {
    return (
      <React.Fragment>
        <h4>{label}</h4>

        <Select
          options={allOptions}
          defaultValue={defaultValue}
          isClearable
          onChange={onChange}
          className='dropdown'
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
