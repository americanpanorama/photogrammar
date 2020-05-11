import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './Photographers.css';

const Photographers = ({ photographers }) => {
  return (
    <div
      className='photographers'
    >
      <p>
        The Farm Security Administration-Office of War Information (FSA-OWI) produced some of the most iconic images of the Great Depression and World War II and employed photographers who shaped the visual culture of the era both in its moment and in American Memory.
      </p>
      <p>
        In 1964 and 1965 Richard Doud conducted oral histories with many of the FSA-OWI photographers. Those marked with a 
        <svg
          width={20}
          height={20}
        >
          <g transform='translate(10 11)'>
            <line
              x1={0}
              x2={0}
              y1={-6}
              y2={0}
              stroke='#777'
              strokeWidth={4}
              strokeLinecap="round"
            />

            <path
              d="M-5,0 a1,1 0 0,0 10,0"
              fill="transparent"
              stroke='#777'
              strokeWidth={2}
            />

            <line
              x1={0}
              x2={0}
              y1={5}
              y2={8}
              stroke='#777'
              strokeWidth={2}
              strokeLinecap="round"
            />

            <line
              x1={-3}
              x2={3}
              y1={8}
              y2={8}
              stroke='#777'
              strokeWidth={1}
              strokeLinecap="round"
            />
          </g>
        </svg>
        include interviews.
      </p>
      <div className='photographerCards'>
        {photographers.map(photographer => (
          <Link
            to={`/photographers/${photographer.key}`}
            key={`${photographer.key}`}
          >
            <figure
              className='photographerCard'
            >
              <img
                src={`${process.env.PUBLIC_URL}/static/photographerPhotos/${photographer.img}`}
              />
              <figcaption>
                <span
                  className='count'
                >
                  {`${photographer.count.toLocaleString()} photos`}
                </span>
                {(photographer.interview && photographer.interview.files && photographer.interview.files.length > 0) && (
                  <svg
                    width={20}
                    height={20}
                  >
                    <g transform='translate(10 11)'>
                      <line
                        x1={0}
                        x2={0}
                        y1={-6}
                        y2={0}
                        stroke='#777'
                        strokeWidth={4}
                        strokeLinecap="round"
                      />

                      <path
                        d="M-5,0 a1,1 0 0,0 10,0"
                        fill="transparent"
                        stroke='#777'
                        strokeWidth={2}
                      />

                      <line
                        x1={0}
                        x2={0}
                        y1={5}
                        y2={8}
                        stroke='#777'
                        strokeWidth={2}
                        strokeLinecap="round"
                      />

                      <line
                        x1={-3}
                        x2={3}
                        y1={8}
                        y2={8}
                        stroke='#777'
                        strokeWidth={1}
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>

                )}

                {`${photographer.firstname} ${photographer.lastname}`}
              </figcaption>
            </figure>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Photographers;

Photographers.propTypes = {
  photographers: PropTypes.array.isRequired,
};

Photographers.defaultProps = {

};
