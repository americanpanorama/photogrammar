import React from 'react';
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
    count,
  } = props;
  const from = sidebarPhotosOffset + 1;
  const to = (count) ? Math.min(sidebarPhotosOffset + displayableCards, count)
    : sidebarPhotosOffset + displayableCards;

  return (
    <header className="highlight-text">
      <h3>
        {label}
      </h3>
      <div className='timeAndNav'>
        <h4>
          {dateStr}
        </h4>
        <h4 className='counts'>
          {`${from}-${to} of ${count}`}
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

