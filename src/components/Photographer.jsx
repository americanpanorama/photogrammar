import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player'
import InterviewTimestamp from './InterviewTimestamp.jsx';
import ConditionalWrapper from './ConditionalWrapper.jsx';
import './Photographer.css';

const Photographer = ({ selectedPhotographerData, expandedSidebar }) => {
  const { photographerKey } = useParams();
  const ref = useRef(null);

  const [selectedInterview, setSelectedInterview] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sectionPlaying, setSectionPlaying] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const loadInterview = async (num) => {
    const response = await fetch(`${process.env.PUBLIC_URL}/static/interviews/${interview.files[num].transcript}`);
    const json = await response.json();
    if (json) {
      setSelectedInterview(num);
      setTranscript(json);
      setRecording(`${process.env.PUBLIC_URL}/static/interviews/${interview.files[num].recording}`);
    }
  }

  useEffect(() => {
    if (interview && !selectedInterview && interview.files && selectedInterview !== 0) {
      loadInterview(0);
    }
  });

  if (!selectedPhotographerData) {
    return null;
  }

  const {
    firstname,
    lastname,
    bio,
    img,
    interview,
  } = selectedPhotographerData;

  const syncTranscript = (e) => {
    const { playedSeconds } = e;
    const timeIndexes = Object.keys(transcript);
    const selectedTimestamp = timeIndexes.find((ti, idx) => ti <= playedSeconds
        && (timeIndexes[idx + 1] > playedSeconds || idx === timeIndexes.length -1));
    if (selectedTimestamp && sectionPlaying !== selectedTimestamp) {
      setSectionPlaying(selectedTimestamp);
    }
  };

  const hasInterview = interview && interview.files && interview.files.length > 0;

  console.log(selectedInterview);

  return (
    <div className='photographer'>
      <div className='close'>
        <Link to={`/photographers`}>
          <button>
            <svg
              width={25}
              height={25}
            >
              <g transform='translate(12.5 12.5)'>
                <line
                  x1={-5}
                  x2={5}
                  y1={-5}
                  y2={5}
                />
                <line
                  x1={-5}
                  x2={5}
                  y1={5}
                  y2={-5}
                />
              </g>
            </svg>
          </button>
        </Link>
      </div>
      <h2>
        {`${firstname} ${lastname}`}
      </h2>
      <ConditionalWrapper
        condition={expandedSidebar}
        wrapper={children => <div className='photographerData'>{children}</div>}
      >
        <div className='photoAndBio'>
          <figure>
            <img src={`${process.env.PUBLIC_URL}/static/photographerPhotos/${img}`} />
          </figure>
          {(bio) && (
            <div>
              {bio.map((p) => (
                <p key={p}>
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>
        {(hasInterview) && (
          <div className='interviews'>
            <h4>
              {interview.name}
            </h4>

            <div className='controls_nav'>
              {(interview.files.length > 1) && (
                <React.Fragment>
                  Parts 
                  {interview.files.map((files, idx) => (
                    <button
                      onClick={() => { loadInterview(idx) }}
                      className={(idx === selectedInterview) ? 'active partsButton' : 'partsButton'}
                    >
                      {idx}
                    </button>
                  ))}
                </React.Fragment>
              )}
              <button
                onClick={() => { 
                  if (autoScroll) {
                    setSectionPlaying(null);
                  }
                  setAutoScroll(!autoScroll);
                }}
                className='disableScrolling'
              >
                {(autoScroll) ? 'disable auto scrolling' : 'enable auto scrolling'}
              </button>
            </div>


            {(recording) && (
              <div key={interview.file}>
                <ReactPlayer
                  url={recording}
                  playing={isPlaying}
                  onProgress={(autoScroll) ? syncTranscript : () => false}
                  ref={ref}
                  width='90%'
                  height='50px'
                  controls={true}
                />
              </div>
            )}


            {(transcript) && (
              <React.Fragment>

                <div className='transcript'>

                  {Object.keys(transcript).map(timestamp => (
                    <InterviewTimestamp
                      timestamp={timestamp}
                      paragraphs={transcript[timestamp]}
                      isPlaying={sectionPlaying === timestamp}
                      autoScroll={autoScroll}
                      key={timestamp}
                    />
                  ))}
                </div>
              </React.Fragment>
            )}
          </div>
        )}
      </ConditionalWrapper>
    </div>
  );
};

export default Photographer;

Photographer.propTypes = {
  transcription: PropTypes.string,
  bio: PropTypes.string,
};

Photographer.defaultProps = {
  transcription: null,
  bio: null,
};
