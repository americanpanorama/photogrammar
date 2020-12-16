import React, { useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import './InterviewTimestamp.css';

interface Props {
  timestamp: number;
  paragraphs: string[]
  isPlaying?: boolean;
  jumpTo?: (timestamp: number) => void; 
  highlight: string[];
}

const InterviewTimestamp = ({ timestamp, paragraphs, isPlaying, jumpTo, highlight }: Props) => {
  const ref = useRef<HTMLInputElement>();

  useEffect(() => {
    if (isPlaying) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [isPlaying]);

  const toHHMMSS = (sec_num: number): string => {
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
        onClick={(jumpTo) ? () => jumpTo(timestamp) : () => false}
      >
        {toHHMMSS(timestamp)}
      </div>
      <div className='section'>
        {paragraphs.map((p, idx) => (
          <p key={`paragraph${idx} ${p.substring(0, 30)}`}>
            <Highlighter
              searchWords={highlight}
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
