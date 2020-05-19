import React from 'react';
import PropTypes from 'prop-types';
import './Lightbox.css';

const Lightbox = ({ imgPath, captionLines, toggleLightbox }) => {
  if (!imgPath) {
    return null;
  }

  return (
    <div id='lightbox'>
      <button
        onClick={toggleLightbox}
        role='close'
      >
        <svg
          width={40}
          height={40}
        >
          <g transform='translate(20 20)'>
            <line
              x1={-12}
              x2={12}
              y1={-12}
              y2={12}
            />
            <line
              x1={-12}
              x2={12}
              y1={12}
              y2={-12}
            />
          </g>
        </svg>
      </button>

      <figure>
        <img 
          src={`http://photogrammar.yale.edu/photos/service/pnp/${imgPath}`}
          alt={captionLines.join('; ')}
        />
        {(captionLines.length > 0) && (
          <figcaption>
            {captionLines.map(line => (
              <div key={`caption ${line}`}>
                {line}
              </div>
            ))}
          </figcaption>
        )}
      </figure>
    </div>
  );
};

export default Lightbox;

Lightbox.propTypes = {
  imgPath: PropTypes.string,
  captionLines: PropTypes.array,
  toggleLightbox: PropTypes.func.isRequired,
};

Lightbox.defaultProps = {
  imgPath: null,
  captionLines: [],
};
