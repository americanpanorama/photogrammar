import React, { useState, useRef } from 'react';
import './OralHistoriesSearchForm.css';

const OralHistoriesSearchForm = ({ searchFor }: { searchFor?: string; }) => {
  const filterTermsRef = useRef<HTMLInputElement>();
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    window.location.href = `${process.env.PUBLIC_URL}/ohsearch/${filterTermsRef.current.value}`;
  };

  let className = 'filter';
  if (isSearching) {
    className = `${className} active`;
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        id='oralHistorySearch'
      >
        <input
          type='text'
          ref={filterTermsRef}
          placeholder={(searchFor) ? searchFor : 'search the oral histories'}
          onFocus={() => { setIsSearching(true) }}
          onBlur={() => { setIsSearching(false) }}
        />
      </form>
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

export default OralHistoriesSearchForm;
