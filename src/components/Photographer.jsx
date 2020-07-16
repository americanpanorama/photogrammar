import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player'
import InterviewTimestamp from './InterviewTimestamp.jsx';
import ConditionalWrapper from './ConditionalWrapper.jsx';
import CloseButton from './buttons/Close.jsx';
import './Photographer.css';

const Photographer = ({ selectedPhotographerData, expandedSidebar }) => {
  const { photographerKey, interviewKey, timestampKey, highlight } = useParams();
  console.log(useParams());
  const ref = useRef(null);

  const [selectedInterview, setSelectedInterview] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sectionPlaying, setSectionPlaying] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);

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
      loadInterview(interviewKey || 0);
    }
  });

  if (!selectedPhotographerData) {
    return null;
  }

  const {
    key,
    firstname,
    lastname,
    bio,
    img,
    interview,
  } = selectedPhotographerData;

  const hasInterview = interview && interview.files && interview.files.length > 0;

  const syncTranscript = (e) => {
    const { playedSeconds } = e;
    const timeIndexes = Object.keys(transcript);
    const selectedTimestamp = timeIndexes.find((ti, idx) => ti <= playedSeconds
        && (timeIndexes[idx + 1] > playedSeconds || idx === timeIndexes.length -1));
    if (selectedTimestamp && sectionPlaying !== selectedTimestamp && playedSeconds > 0) {
      setSectionPlaying(selectedTimestamp);
    }
  };

  const jumpTo = (seconds) => {
    console.log(seconds);
    ref.current.seekTo(seconds);
    // if this is initiated from the url, don't start playing--if from a link do
    if (playerReady && !isPlaying) {
      setIsPlaying(true);
    } else {
      setPlayerReady(true);
    }
  }

  return (
    <div className={(key !== 'AikenAndWool') ? 'photographer' : 'photographer AikenAndWool'}>
      <div className='close'>
        <Link to={`/photographers`}>
          <CloseButton role='close' />
        </Link>
      </div>
      <h2>
        {`${firstname} ${lastname}`}
      </h2>
      <ConditionalWrapper
        condition={expandedSidebar}
        wrapper={children => <div className='photographerData'>{children}</div>}
      >
        <figure>
          <img src={`${process.env.PUBLIC_URL}/static/photographerPhotos/${img}`} />
        </figure>

        <div className='bioAndInterviews'>
          {(bio) && (
            <div>
              {bio.map((p) => {
                const mdLinksPattern = new RegExp(/(\[[^\[]+\]\s?\(.+?\))/gm);
                const mdEmPattern = new RegExp(/(\*[^*]*\*)/gm);
                const splitPattern = new RegExp(mdEmPattern.source  + "|" + mdLinksPattern.source);
                return (
                  <p key={p}>
                    {p.split(splitPattern).filter(pPart => pPart).map(pPart => {
                      if (pPart.match(mdLinksPattern)) {
                        const txt = pPart.match(/\[(.*?)\]/)[1];
                        const to = pPart.match(/\((.*?)\)/)[1];

                        return (
                          <Link
                            to={`${process.env.PUBLIC_URL}${to}`}
                            key={pPart}
                          >
                            {txt}
                          </Link>
                        );
                      }
                      if (pPart.match(/\*([^*]*)\*/)) {
                        return (
                          <em key={pPart}>
                            {pPart.match(/\*([^*]*)\*/)[1]}
                          </em>
                        )
                      }
                      return (
                        <React.Fragment key={pPart}>
                          {pPart}
                        </React.Fragment>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          )}
          {(hasInterview) && (
            <div className='interviews'>

              {(interview.link) ? (
                <h4>
                  <a href={interview.link} target='_blank'>
                    {interview.name}
                  </a>
                </h4>
              ) : (
                <h4>
                  {interview.name}
                </h4>
              )}

              {(recording) && (
                <div className='controls_nav'>
                  {(interview.files.length > 1) && (
                    <React.Fragment>
                      Parts 
                      {interview.files.map((files, idx) => (
                        <button
                          onClick={() => { loadInterview(idx) }}
                          className={(idx === selectedInterview) ? 'active partsButton' : 'partsButton'}
                          key={`controlForInterview${idx}`}
                        >
                          {idx + 1}
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
                  
                  <ReactPlayer
                    url={recording}
                    playing={isPlaying}
                    onProgress={(autoScroll) ? syncTranscript : () => false}
                    onReady={(timestampKey && !playerReady) ? () => jumpTo(timestampKey, false) : () => false}
                    ref={ref}
                    width='90%'
                    height='50px'
                    controls={true}
                  />
                </div>
              )}

              {(transcript) && (
                <div className='transcript'>
                  {Object.keys(transcript).map(timestamp => (
                    <InterviewTimestamp
                      timestamp={timestamp}
                      paragraphs={transcript[timestamp]}
                      highlight={[highlight || '']}
                      isPlaying={sectionPlaying === timestamp}
                      autoScroll={autoScroll}
                      key={timestamp}
                      jumpTo={jumpTo}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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
