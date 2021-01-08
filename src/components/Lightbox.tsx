import React from 'react';
import Async from "react-async";
import { Link } from "react-router-dom";
import './Lightbox.css';
import { PhotoMetadata } from '../index.d';

const loadPhotoData = async ({ photoMetadataQuery }: { photoMetadataQuery: string }) => {
  const response = await fetch(photoMetadataQuery);
  if (!response.ok) { console.warn(response) }
  const dbDataPhoto: { rows: PhotoMetadata[] } = await response.json();
  return dbDataPhoto.rows[0];
}

const Lightbox = ({ fetchPath, closeLink }: { fetchPath: string; closeLink: string}) => {
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
          } = data;

          const captionLines: string[] = [];
          if (caption) {
            captionLines.push(`"${caption}"`);
          }
          const linePieces: string[] = [];
          if (photographer_name) {
            linePieces.push(photographer_name);
          }
          if (month && year) {
            linePieces.push(`${monthNames[month]}, ${year}`);
          } else if (year) {
            linePieces.push(year.toString());
          }
          if (city && state) {
            linePieces.push(`${city}, ${state}`);
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
                  src={`//s3.amazonaws.com/dsl-general/photogrammar/${img_large_path}`}
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
