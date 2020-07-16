import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './InterviewTimestamp.css';
import Highlighter from 'react-highlight-words';

const InterviewTimestamp = ({ timestamp, paragraphs, isPlaying, jumpTo, highlight }) => {
  const ref = useRef();

  useEffect(() => {
    if (isPlaying) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [isPlaying]);

  const toHHMMSS = (sec_num) => {
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    return [hours, minutes, seconds]
      .map(n => (n < 10) ? `0${n}`: n)
      .join(':');
  };

  return (
    <div
      key={timestamp}
      ref={ref}
      className='transcriptSection'
      style={{
        color: (isPlaying) ? 'black' : '#555',
      }}
    >
      <div
        className='timestamp'
        onClick={() => jumpTo(timestamp)}
      >
        {toHHMMSS(timestamp)}
      </div>
      <div className='section'>
        {paragraphs.map((p, idx) => (
          <p key={`paragraph${idx} ${p.substring(0, 30)}`}>
            <Highlighter
              searchWords={[highlight]}
              textToHighlight={p}
              key={`paragraph${idx} ${p.substring(0, 30)}`}
            />
          </p>
        ))}
      </div>
    </div>
  );
};

export default InterviewTimestamp;

InterviewTimestamp.propTypes = {
  timestamp: PropTypes.string.isRequired,
  paragraphs: PropTypes.array.isRequired,
  highlight: PropTypes.string,
};

InterviewTimestamp.defaultProps = {
  isPlaying: false,
  jumpTo: () => false,
  highlight: '',
};
