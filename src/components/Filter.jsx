
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Filter.css';

const Filter = ({ terms, setFilterTerms, clearFilterTerms }) => {
  const filterTermsRef = useRef();
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltered, setIsFiltered] = useState(terms.length > 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilterTerms(filterTermsRef.current.value);
  };

  const handleReset = () => {
    setIsFiltered(false);
    filterTermsRef.current.value = null;
    clearFilterTerms();
  };

  let className = 'filter';
  if (isSearching) {
    className = `${className} active`;
  }
  if (isFiltered) {
    className = `${className} filtered`;
  }

  return (
    <div className={className}
      id='search'
    >
      <form
        onSubmit={handleSubmit}
        id='filterForm'
      >
        <input
          type='text'
          ref={filterTermsRef}
          placeholder={(terms.length > 0) ? terms.join(' ') : 'filter by photo captions'}
          onChange={() => { setIsFiltered(filterTermsRef.current.value.length > 0)}}
          onFocus={() => { setIsSearching(true) }}
          onBlur={() => { setIsSearching(false) }}
          value={(!isSearching) ? terms.join(' ') : null}
        />
      </form>
      {(isFiltered > 0) && (
        <button
          type='reset'
          onClick={handleReset}
          form='filterForm'
        >
          <svg
            width={30}
            height={30}
          >
            <g transform={`translate(15 15) rotate(45)`}>
              <line
                x1={0}
                x2={0}
                y1={-9}
                y2={9}
                strokeWidth={2}
              />
              <line
                x1={-9}
                x2={9}
                y1={0}
                y2={0}
                strokeWidth={2}
              />
            </g>
          </svg>
        </button>
      )}
      <button
        type='submit'
        form='filterForm'
      >
        <svg
          width={30}
          height={30}
        >
          <g transform={`translate(15 18) rotate(315)`}>
            <circle
              cx={0}
              cy={18 * 1.5  * -0.1}
              r={18  * 1.5  * 0.2}
              fill='transparent'
              fillOpacity={1}
              strokeWidth={18 / 9}
            />
            <line
              x1={0}
              x2={0}
              y1={18  * 1.5  * 0.1}
              y2={18  * 1.5  * 0.4}
              strokeWidth={18 / 7}
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default Filter;

Filter.propTypes = {
  terms: PropTypes.array,
  setFilterTerms: PropTypes.func.isRequired,
  clearFilterTerms: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  terms: [],
};
