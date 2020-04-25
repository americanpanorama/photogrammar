import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './SidebarHeader.css';

const SidebarPhotosHeader = (props) => {
  const {
    label,
    dateStr,
    displayableCards,
    sidebarPhotosOffset,
    previousOffset,
    nextOffset,
    setPhotoOffset,
    setFilterTerms,
    count,
  } = props;
  const from = sidebarPhotosOffset + 1;
  const to = (count) ? Math.min(sidebarPhotosOffset + displayableCards, count)
    : sidebarPhotosOffset + displayableCards;

  const filterTermsRef = useRef();
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilterTerms(filterTermsRef.current.value);
  }

  return (
    <header className="highlight-text">
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
      <h3>
        {label}
      </h3>
      <div className='timeAndNav'>
        <h4>
          {dateStr}
        </h4>
        <h4 className='counts'>
          {`${from}-${to} of ${count.toLocaleString()}`}
        </h4>
        <button
          onClick={setPhotoOffset}
          id={previousOffset}
          disabled={previousOffset < 0}
        >
          {'<'}
        </button>
        <button
          onClick={setPhotoOffset}
          id={nextOffset}
          disabled={!nextOffset || nextOffset > count}
        >
          {'>'}
        </button>
      </div>
      
    </header>
  );

};

export default SidebarPhotosHeader;

SidebarPhotosHeader.propTypes = {
  label: PropTypes.string.isRequired,
  displayableCards: PropTypes.number.isRequired,
  sidebarPhotosOffset: PropTypes.number.isRequired,
  previousOffset: PropTypes.number.isRequired,
  nextOffset: PropTypes.number.isRequired,
  setPhotoOffset: PropTypes.func.isRequired,
  count: PropTypes.number,
};

SidebarPhotosHeader.defaultProps = {
  count: null,
};

