import React from 'react';
import PropTypes from 'prop-types';
import Async from "react-async";
import { Link, useLocation } from "react-router-dom";
import SimilarPhotoCard from './sidebar/PhotoCardSimilar.js';
import State from './State.jsx';
import CloseButton from './buttons/Close.jsx';
import ExpandButton from './buttons/Expand.jsx';
import States from '../../data/svgs/states.json';
import './Photo.css';
import { getCentroidForCounty } from '../helpers.js';

const loadPhotoData = async ({ photoMetadataQuery, similarPhotosQuery }, { signal }) => {
  const responses = await Promise.all([
    fetch(photoMetadataQuery, { signal }),
    fetch(similarPhotosQuery, { signal })
  ]);
  if (responses.some(res => !res.ok)) { console.warn(res) }
  return {
    photoMetadata: await responses[0].json(),
    similarPhotos: await responses[1].json(),
  };
}

const Photo = (props) => {
  const {
    photoMetadataQuery,
    similarPhotosQuery,
    selectedMapView,
    height,
    toggleLightbox,
    buildLink,
  } = props;

  const { pathname, hash } = useLocation();

  const stripPhotos = [];

  return (
    <Async
      promiseFn={loadPhotoData}
      photoMetadataQuery={photoMetadataQuery}
      similarPhotosQuery={similarPhotosQuery}
      watch={photoMetadataQuery}
    >
      {({ data, error, isPending }) => {
        if (isPending) return "Loading...";
        if (error) return `Something went wrong: ${error.message}`;
        if (data) {
          const photoMetadata = data.photoMetadata.rows[0];
          //photoMetadata.caption = (photoMetadata.caption && he) ? he.decode(photoMetadata.caption) : '';

          photoMetadata.stateAbbr = photoMetadata.state;

          photoMetadata.similarPhotos = data.similarPhotos.rows.map(sp => ({
            ...sp,
            caption: (sp.cation) ? he.decode(sp.caption) : '',
            stateAbbr: photoMetadata.state,
          }));

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
            vanderbilt_level1,
            vanderbilt_level2,
            vanderbilt_level3,
            // longitude,
            // latitude,
            img_large_path,
            //stripPhotos,
          } = photoMetadata;
          const photographerKey = photographer_name.replace(/[\s\.]/g, '');
          const centroid = getCentroidForCounty(nhgis_join);

          let date = 'N/A';
          if (month && year) {
            date = `${monthNames[month]} ${year}`;
          } else if (year) {
            date = year;
          }

          // calculate some strip stats
          const stripLength = (stripPhotos && stripPhotos.length > 1) ? stripPhotos[stripPhotos.length -1].num : null;
          const stripNums = (stripPhotos && stripPhotos.length > 1) ? [...Array(stripLength).keys()].map(n => n + 1) : null;
          const selectedPhotoStripNum = (stripPhotos && stripPhotos.length > 1) ? parseInt(photoMetadata.photograph_type.substring(1)) : null;

          const closeLink = buildLink({}, { pathname, hash });
          

          const photographerLink = (photographerKey) ? buildLink({
            replaceOrAdd: [{
              param: 'photographers',
              value: photographerKey,
            }],
          }, { pathname, hash }) : null;
          const vl1Link = (vanderbilt_level1) ? buildLink({
            replaceOrAdd: [{
              param: 'themes',
              value: encodeURI(`root|${vanderbilt_level1}`),
            }],
            remove: ['maps', 'city', 'county', 'state'],
            viz: 'themes',
          }, { pathname, hash }) : null;
          const vl2Link = (vanderbilt_level2) ? buildLink({
            replaceOrAdd: [{
              param: 'themes',
              value: encodeURI(`root|${vanderbilt_level1}|${vanderbilt_level2}`),
            }],
            remove: ['maps', 'city', 'county', 'state'],
            viz: 'themes',
          }, { pathname, hash }) : null;
          const vl3Link = (vanderbilt_level3) ? buildLink({
            replaceOrAdd: [{
              param: 'themes',
              value: encodeURI(`root|${vanderbilt_level1}|${vanderbilt_level2}|${vanderbilt_level3}`),
            }],
            remove: ['maps', 'city', 'county', 'state'],
            viz: 'themes',
          }, { pathname, hash }) : null;
          const placeLink =  buildLink({
            replaceOrAdd: [{
              param: (selectedMapView === 'counties') ? 'county' : 'city',
              value: (selectedMapView === 'counties') ? nhgis_join : city,
            }],
            viz: (selectedMapView === 'counties') ? 'county' : 'city'
          }, { pathname, hash });


          return (
            <div
              className="selectedPhoto"
              style={{
                maxHeight: height,
              }}
            >
              <div className='close'>
                <Link to={closeLink}>
                  <CloseButton />
                </Link>
              </div>
              <div className="metadata">
                <h5>Caption (Original Description)</h5>
                <div className="metadatum">
                  {caption}
                </div>

                <h5>Photographer</h5>
                {(photographerLink) ? (
                  <Link
                    to={photographerLink}
                  >
                    <button>
                      {photographer_name}
                    </button>
                  </Link>
                ) : (
                  <div
                    className="metadatum"
                  >
                    {photographer_name}
                  </div>
                )}

                <h5>Created</h5>
                <div className="metadatum">
                  {date}
                </div>

                {(vanderbilt_level3) && (
                  <React.Fragment>
                    <h5>Classification (Original Tagging System)</h5>
                    <div className='tags'>
                      <Link to={vl1Link}>
                        {vanderbilt_level1}
                      </Link>
                      <Link to={vl2Link}>
                        {vanderbilt_level2}
                      </Link>
                      <Link to={vl3Link}>
                        {vanderbilt_level3}
                      </Link>
                    </div>
                  </React.Fragment>
                )}

                <h5>Location</h5>
                <div className="metadatum">
                  {((city || county) && state && centroid && centroid.center && centroid.center[0]) ? (
                    <Link to={placeLink}>
                      <button>
                        {`${county || city}, ${state}`}
                      </button>
                    </Link>
                  ) : (
                    <span>location unspecified</span>
                  )}
                </div>

                {((city || county) && state && centroid && centroid.center && centroid.center[0]) && (
                  <svg
                    width={300}
                    height={500 * 300 / 960}
                    className='map'
                  >
                    <g transform={`translate(0 ${-300 * 500 / 960 / 2.1}) scale(0.3)`}>
                      {States.filter(s => s.bounds && s.bounds[0] && s.d && s.abbr).map(state => (
                        <path
                          d={state.d}
                          fill='grey'
                          stroke='#999'
                          key={state.abbr}
                        />
                      ))}
                      {(centroid.center && centroid.center[0]) && (
                        <circle
                          cx={300 * centroid.center[0] / 1000 / 0.3}
                          cy={300 * centroid.center[1] / 1000 / 0.3}
                          //cy={centroid.center[1] / 1000 * (500 * 300 / 960)}
                          r={12}
                          fill='lime'
                        />
                      )}
                    </g>
                  </svg>
                )}
              </div>
              <div 
                className="img"

              >
                <img 
                  src={`http://photogrammar.yale.edu/photos/service/pnp/${img_large_path}`}
                  className='full'
                  alt=""
                  onClick={toggleLightbox}
                />
              </div>

              <div
                className='relatedImages'
              >
                {(stripPhotos && stripPhotos.length > 1) && (
                  <React.Fragment>
                    <h5>
                      {`Part of a strip (${selectedPhotoStripNum} of ${stripLength})`}
                    </h5>
                    <div className='strip'>
                      {stripNums.map(num => {
                        const stripPhoto = stripPhotos.find(sp => sp.num === num);
                        if (stripPhoto) {
                          return (
                            <Link to={`/photo/${stripPhoto.loc_item_link}`}>
                              <div
                                className={(num === selectedPhotoStripNum) ? 'stripPhoto selected' : 'stripPhoto'}
                                style={{
                                  backgroundImage: `url('http://photogrammar.yale.edu/photos/service/pnp/${stripPhoto.img_thumb_img}')`,
                                }}
                              >
                                <img src={`http://photogrammar.yale.edu/photos/service/pnp/${stripPhoto.img_thumb_img}`} />
                              </div>
                            </Link>
                          );
                        }
                        return (<div className='missing' />);
                      })}
                    </div>
                  </React.Fragment>
                )}

                {(photoMetadata.similarPhotos.length > 0) && (
                  <React.Fragment>
                    <h2 className='similarPhotosHeader'>Similar Photos</h2>
                    <div className='similarPhotos'>
                      <div className='cards'>
                        {photoMetadata.similarPhotos.map(sp => (
                          <SimilarPhotoCard
                            photo={sp}
                            key={sp.loc_item_link}
                          />
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                )}  
              </div>

              <ExpandButton
                onClick={toggleLightbox}
                role='expand'
              />

            </div>

          );
        }
      }}
    </Async>
  );
};

export default Photo;

Photo.propTypes = {
};

Photo.defaultProps = {
  photoMetadata: null,
};
