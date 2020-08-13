import React from 'react';
import Async from "react-async";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import './Lightbox.css';

const loadPhotoData = async ({ photoMetadataQuery }, { signal }) => {
  const response = await fetch(photoMetadataQuery, { signal });
  if (!response.ok) { console.warn(response) }
  return response.json();
}

const Lightbox = ({ fetchPath, closeLink }) => {
  console.log(fetchPath);
  return (
    <Async
      promiseFn={loadPhotoData}
      photoMetadataQuery={fetchPath}
      watch={fetchPath}
    >
      {({ data, error, isPending }) => {
        if (isPending) return "Loading...";
        if (error) return `Something went wrong: ${error.message}`;
        if (data) {
          console.log(data);

          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

          const {
            photographer_name,
            caption,
            year,
            month,
            city,
            county,
            state,
            stateAbbr,
            nhgis_join,
            img_large_path,
          } = data.rows[0];

          const captionLines = [];
          if (caption) {
            captionLines.push(`"${caption}"`);
          }
          const linePieces = [];
          if (photographer_name) {
            linePieces.push(photographer_name);
          }
          if (month && year) {
            linePieces.push(`${monthNames[month]}, ${year}`);
          } else if (year) {
            linePieces.push(year);
          }
          if (city && state) {
            linePieces.push(`${city}, ${stateAbbr}`);
          } else if (county && stateAbbr) {
            linePieces.push(`${county}, ${stateAbbr}`);
          } else if (stateAbbr) {
            linePieces.push(stateAbbr);
          }
          if (linePieces.length > 0) {
            captionLines.push(linePieces.join('; '));
          }

          return (
            <div id='lightbox'>
              <button
                role='close'
              >
                <Link to={closeLink}>
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
                </Link>
              </button>

              <figure>
                <img 
                  src={`http://photogrammar.yale.edu/photos/service/pnp/${img_large_path}`}
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
        }
      }}
    </Async>
  );
};

export default Lightbox;

Lightbox.propTypes = {
  imgPath: PropTypes.string,
  captionLines: PropTypes.array,
  closeLightbox: PropTypes.func.isRequired,
};

Lightbox.defaultProps = {
  imgPath: null,
  captionLines: [],
};
