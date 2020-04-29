import React from 'react';
import PropTypes from 'prop-types';
import SidebarHeaderPhotographerButton from './SidebarHeaderPhotographerButton.js';
import SidebarHeaderStateButton from './SidebarHeaderStateButton.js';
import SidebarHeaderCityCountyButton from './SidebarHeaderCityCountyButton.js';
import SidebarHeaderThemeButton from './SidebarHeaderThemeButton.js';
import SidebarHeaderFilterButton from './SidebarHeaderFilterButton.js';
import './SidebarHeader.css';

const SidebarPhotosHeader = (props) => {
  const {
    hasFacet,
    dateStr,
    displayableCards,
    sidebarPhotosOffset,
    previousOffset,
    nextOffset,
    setPhotoOffset,
    count,
  } = props;
  const from = sidebarPhotosOffset + 1;
  const to = (count) ? Math.min(sidebarPhotosOffset + displayableCards, count)
    : sidebarPhotosOffset + displayableCards;

  return (
    <header className="highlight-text">
      {(hasFacet) ? (
        <div className='facets'>
          <SidebarHeaderPhotographerButton />
          <SidebarHeaderCityCountyButton />
          <SidebarHeaderStateButton />
          <SidebarHeaderThemeButton />
          <SidebarHeaderFilterButton />
        </div>
      ) : (
        <h3>
          Random selection of photographs
        </h3>
      )}
      <div className='timeAndNav'>
        <h4>
          {dateStr}
        </h4>
        <h4 className='counts'>
          {`${from}-${to} of `}
          <strong>
            {count.toLocaleString()}
          </strong>
        </h4>
        <button
          onClick={setPhotoOffset}
          id={previousOffset}
          disabled={previousOffset < 0}
        >
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
              />
              <line
                x1={0}
                x2={8}
                y1={0}
                y2={5}
              />
            </g>
          </svg>
        </button>
        <button
          onClick={setPhotoOffset}
          id={nextOffset}
          disabled={!nextOffset || nextOffset > count}
        >
          <svg
            width={25}
            height={25}
          >
            <g transform='translate(16 12.5)'>
              <line
                x1={0}
                x2={-8}
                y1={0}
                y2={-5}
              />
              <line
                x1={0}
                x2={-8}
                y1={0}
                y2={5}
              />
            </g>
          </svg>
        </button>
      </div>
      
    </header>
  );
};

export default SidebarPhotosHeader;

SidebarPhotosHeader.propTypes = {
  hasFacet: PropTypes.bool.isRequired,
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

