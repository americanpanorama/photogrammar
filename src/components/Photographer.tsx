import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Link, useParams } from "react-router-dom";
// @ts-ignore
import ReactPlayer from 'react-player'
import InterviewTimestamp from './InterviewTimestamp';
import ConditionalWrapper from './ConditionalWrapper.jsx';
import CloseButton from './buttons/Close';
import './Photographer.css';
import { PhotographerMetadata } from '../index.d';
import { Props, Params } from './Photographer.d';

const Photographer = ({ selectedPhotographerData, expandedSidebar }: Props) => {
  const { photographerKey, interviewKey, timestampKey, highlight }: Params = useParams();
  const ref = useRef(null);

  const [selectedInterview, setSelectedInterview] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sectionPlaying, setSectionPlaying] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    if (interview && !selectedInterview && interview.files && selectedInterview !== 0) {
      loadInterview(parseInt(interviewKey) || 0);
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
    locId,
  } = selectedPhotographerData;

  const hasInterview = interview && interview.files && interview.files.length > 0;

  const loadInterview = async (num: number) => {
    const response = await fetch(`${process.env.PUBLIC_URL}/static/interviews/${interview.files[num].transcript}`);
    const json = await response.json();
    if (json) {
      setSelectedInterview(num);
      setTranscript(json);
      setRecording(`${process.env.PUBLIC_URL}/static/interviews/${interview.files[num].recording}`);
    }
  }

  const syncTranscript = (e: any): void => {
    const { playedSeconds } = e;
    const timeIndexes = Object.keys(transcript);
    const selectedTimestamp = timeIndexes.find((ti, idx) => ti <= playedSeconds
        && (timeIndexes[idx + 1] > playedSeconds || idx === timeIndexes.length -1));
    if (selectedTimestamp && sectionPlaying !== selectedTimestamp && playedSeconds > 0) {
      setSectionPlaying(selectedTimestamp);
    }
  };

  const jumpTo = (seconds: number): void => {
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
        wrapper={(children: ReactNode) => <div className='photographerData'>{children}</div>}
      >
        <figure>
          <img src={`${process.env.PUBLIC_URL}/static/photographerPhotos/${img}`} />
        </figure>

        <div className='bioAndInterviews'>
          {(bio) && (
            <div>
              {bio.map((p: string, idx: number) => {
                const mdLinksPattern = new RegExp(/(\[[^\[]+\]\s?\(.+?\))/gm);
                const mdEmPattern = new RegExp(/(\*[^*]*\*)/gm);
                const splitPattern = new RegExp(mdEmPattern.source  + "|" + mdLinksPattern.source);
                return (
                  <p key={`paragraph${idx} ${p.substring(0, 30)}`}>
                    {p.split(splitPattern).filter(pPart => pPart).map((pPart: string, partIdx: number) => {
                      if (pPart.match(mdLinksPattern)) {
                        const txt = pPart.match(/\[(.*?)\]/)[1];
                        const to = pPart.match(/\((.*?)\)/)[1];

                        return (
                          <Link
                            to={to}
                            key={`markdown${partIdx} ${pPart.substring(0, 30)}`}
                          >
                            {txt}
                          </Link>
                        );
                      }
                      if (pPart.match(/\*([^*]*)\*/)) {
                        return (
                          <em key={`markdown${partIdx} ${pPart.substring(0, 30)}`}>
                            {pPart.match(/\*([^*]*)\*/)[1]}
                          </em>
                        )
                      }
                      return (
                        <React.Fragment key={`markdown${partIdx} ${pPart.substring(0, 30)}`}>
                          {pPart}
                        </React.Fragment>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          )}

           <div>For more information: <a href={locId} target='_blank'>Library of Congress Named Authority File</a></div>
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
                    onReady={(timestampKey && !playerReady) ? () => jumpTo(parseInt(timestampKey)) : () => false}
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
                      timestamp={parseInt(timestamp)}
                      paragraphs={transcript[timestamp]}
                      highlight={[highlight || '']}
                      isPlaying={sectionPlaying === timestamp}
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
