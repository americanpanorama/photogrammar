import React from 'react';
import PropTypes from 'prop-types';

const Filter = ({ terms }) => {
  return (
    <div class='filter'>
      <form
        onSubmit={handleSubmit}
        className={(isSearching) ? 'active' : ''}
      >
        <input
          type='text'
          ref={filterTermsRef}
          placeholder='filter by photo caption'
          onFocus={() => setIsSearching(true)}
          onBlur={() => setIsSearching(false)}
        />
        <button type='submit'>
          <svg
            width={26}
            height={30}
          >
            <g transform={`translate(${18 / 2 * 1.5} ${18 / 2 * 1.5}) rotate(315)`}>
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
      </form>
    </div>
  );
};

export default Filter;

Filter.propTypes = {
  terms: PropTypes.array,
};

Filter.defaultProps = {
  
};
