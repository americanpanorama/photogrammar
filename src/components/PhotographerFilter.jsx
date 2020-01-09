import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PhotographerFilter.css';

const PhotographerFilter = ({ photographers, selectedPhotographer, selectPhotographer }) => {
  //const initialTranslateY = (selectedPhotographer) ? photographers.findIndex(p => p.key === selectedPhotographer) * -25 : photographers.length * 25;
  //const [translateY, setTranslateY] = useState(-initialTranslateY);
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSelect = () => setIsOpen(!isOpen);

  const handleSelection = (e) => {
    const selected = e.currentTarget.id;
    toggleSelect();
    selectPhotographer(selected);
  }


  if (!isOpen && !selectedPhotographer) {
    return (
      <ul
        className='photographerFilter'
      >
        <li
          onClick={toggleSelect}
        >
          All Photographers
        </li>
      </ul>
    );
  }

  if (!isOpen && selectedPhotographer) {
    const p = photographers.find(p => p.key === selectedPhotographer);
    return (
      <ul
        className='photographerFilter'
      >
        <li
          onClick={toggleSelect}
        >
          <span className='name'>
            {`${p.firstname} ${p.lastname}`}
          </span>
          <span
            className='dot'
            style={{
              backgroundColor: p.color,
            }}
          />
        </li>
      </ul>
    );
  }

  return (
    <ul
      className='photographerFilter'
      style={{
        transform: `translateY(${(photographers.length)* -25}px`,
        //maxHeight: translateY * -1 + 3 * 25 + 10,
      }}
    >
      {photographers.map(p => (
        <li
          key={p.key}
          id={p.key}
          onClick={handleSelection}
          style={{
            backgroundColor: (p.key === selectedPhotographer) ? '#eee' : 'transparent',
          }}
        >
          <span className='name'>
            {`${p.firstname} ${p.lastname}`}
          </span>
          <span
            className='dot'
            style={{
              backgroundColor: p.color,
            }}
          />
        </li>
      ))}
      <li
        onClick={handleSelection}
        style={{
          backgroundColor: (!selectedPhotographer) ? '#eee' : 'transparent',
        }}
      >
        All Photographers
      </li>
    </ul>
  );
};

export default PhotographerFilter;

PhotographerFilter.propTypes = {
  photographers: PropTypes.array,
  selectedPhotographer: PropTypes.string,
  selectPhotographer: PropTypes.func.isRequired,
};

PhotographerFilter.defaultProps = {
  selectedPhotographer: null,
};

