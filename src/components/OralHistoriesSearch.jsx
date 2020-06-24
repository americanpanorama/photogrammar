import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import lunr from 'lunr';
import PropTypes from 'prop-types';
import InterviewTimestamp from './InterviewTimestamp.jsx';
import './OralHistoriesSearch.css';

const OralHistoriesSearch = ({  }) => {
  const { searchFor } = useParams();
  const [idx, setIdx] = useState(null);
  const [searchResultsData, setSearchResultsData] = useState([]);
  const [results, setResults] = useState([]);
  const [interviewsToLoad, setInterviewsToLoad] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const filterTermsRef = useRef();
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltered, setIsFiltered] = useState(searchFor);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilterTerms(filterTermsRef.current.value);
  };

  const handleReset = () => {
    setIsFiltered(false);
    filterTermsRef.current.value = null;
    clearFilterTerms();
  };

  let className = 'filter';
  if (isSearching) {
    className = `${className} active`;
  }
  if (isFiltered) {
    className = `${className} filtered`;
  }

  const loadIdx = async (num) => {
    const response = await fetch(`${process.env.PUBLIC_URL}/static/interviews/index.json`);
    const json = await response.json();
    if (json) {
      setIdx(lunr.Index.load(json));
    }
  };
  // load the index
  useEffect(() => {
    loadIdx(searchFor);
  }, []);

  // load the maching interviews
  useEffect(() => {
    if (searchResultsData.length > 0) {
      const loadInterviews = async files => {
        const transcripts = await Promise.all(
          files.map(async file => {
            const fileResponse = await fetch(`${process.env.PUBLIC_URL}/static/interviews/${file}`);
            const transcript = await fileResponse.json();
            return {
              file,
              transcript,
            }
          })
        );
        // add to search results
        searchResultsData.forEach((sr, srIdx) => {
          const transcript = transcripts.find(t => t.file === sr.file);
          sr.text = transcript.transcript[sr.timestamp][sr.pIdx];
        });
        setResults(searchResultsData);
      };

      const toLoad = [...new Set(searchResultsData.map(sr => sr.file))];
      const transcripts = loadInterviews(toLoad);
    }
  });

  if (!idx) {
    return null;
  }

  // run the search 
  if (searchFor && searchResultsData.length === 0) {
    const searchResultsLunrData = idx.search(searchFor);
    // parse the results
    setSearchResultsData(searchResultsLunrData.map(d => {
      const [file, timestamp, pIdx] = d.ref.split('-');
      return {
        file,
        timestamp,
        pIdx,
        key: d.ref,
        text: null,
      };
    }));
  }

  return (
    <div id='ohSearch'>
      <div className={className}

      >
        <form
          onSubmit={handleSubmit}
          id='filterForm'
        >
          <input
            type='text'
            ref={filterTermsRef}
            placeholder={(searchFor) ? searchFor : 'filter by photo captions'}
            onChange={() => { setIsFiltered(filterTermsRef.current.value.length > 0)}}
            onFocus={() => { setIsSearching(true) }}
            onBlur={() => { setIsSearching(false) }}
            value={(!isSearching) ? searchFor : null}
          />
        </form>
        {(isFiltered > 0) && (
          <button
            type='reset'
            onClick={handleReset}
            form='filterForm'
          >
            <svg
              width={30}
              height={30}
            >
              <g transform={`translate(15 15) rotate(45)`}>
                <line
                  x1={0}
                  x2={0}
                  y1={-9}
                  y2={9}
                  strokeWidth={2}
                />
                <line
                  x1={-9}
                  x2={9}
                  y1={0}
                  y2={0}
                  strokeWidth={2}
                />
              </g>
            </svg>
          </button>
        )}
        <button
          type='submit'
          form='filterForm'
        >
          <svg
            width={30}
            height={30}
          >
            <g transform={`translate(15 18) rotate(315)`}>
              <circle
                cx={0}
                cy={18 * 1.5  * -0.1}
                r={18  * 1.5  * 0.2}
                fill='transparent'
                fillOpacity={1}
                strokeWidth={18 / 9}
              />
              <line
                x1={0}
                x2={0}
                y1={18  * 1.5  * 0.1}
                y2={18  * 1.5  * 0.4}
                strokeWidth={18 / 7}
              />
            </g>
          </svg>
        </button>
      </div>
      <div id='interviewResults'>
        {results.map(i => (
          <div
            key={i.key}
          >
            <InterviewTimestamp
              timestamp={i.timestamp}
              paragraphs={[i.text]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OralHistoriesSearch;

OralHistoriesSearch.propTypes = {

};

OralHistoriesSearch.defaultProps = {

};
