import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import * as lunr from 'lunr';
import OralHistoriesSearchForm from './OralHistoriesSearchForm';
import InterviewTimestamp from './InterviewTimestamp';
import CloseButton from './buttons/Close';
import photographersMetadata from '../../data/photographersMetadata.json';
import notPhotographersMetadata from '../../data/notPhotographersMetadata.json';
import './OralHistoriesSearch.css';
import { PhotographerMetadata } from '../index.d';
import { Params, LunrSearchResult, SearchResult, Transcript, SearchResultWithTranscript } from './OralHistoriesSearch.d';

const OralHistoriesSearch = ({ }) => {
  const { searchFor }: Params = useParams();
  const [idx, setIdx] = useState(null);
  const [searchResultsData, setSearchResultsData] = useState<SearchResult[]>([]);
  const [results, setResults] = useState([]);
  const [completedSearchFor, setCompletedSearchFor] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltered, setIsFiltered] = useState(searchFor);
  const filterTermsRef = useRef(searchFor);

  const peopleMetadata: PhotographerMetadata[] = (photographersMetadata as PhotographerMetadata[]).concat(notPhotographersMetadata as PhotographerMetadata[]);

  // load the index
  useEffect(() => {
    const loadIdx = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/static/interviews/index.json`);
      const json = await response.json();
      if (json) {
        setIdx(lunr.Index.load(json));
      }
    };
    loadIdx();
  }, []);

  // run the search 
  if (idx && searchFor && searchResultsData.length === 0 && completedSearchFor !== searchFor) {
    const searchResultsLunrData: LunrSearchResult[] = idx.search(`+${searchFor}`);
    if (searchResultsLunrData.length === 0) {
      setCompletedSearchFor(searchFor);
    }
    // parse the results
    const searchResults: SearchResult[] = searchResultsLunrData.map((d: LunrSearchResult): SearchResult => {
      const [file, timestamp, pIdx, photographerKey] = d.ref.split('-');
      const citationPieces = peopleMetadata.find(pm => pm.key === photographerKey).interview.name.split(', ');
      const citation = citationPieces[0];
      const citationMetadata = citationPieces.slice(1).join(', ');
      const interviewIdx = peopleMetadata.find(pm => pm.key === photographerKey).interview.files.findIndex(iFile => iFile.transcript === file);
      return {
        file,
        timestamp: parseInt(timestamp),
        pIdx: parseInt(pIdx),
        photographerKey,
        interviewIdx,
        citation,
        citationMetadata,
        key: d.ref,
        text: null,
        score: d.score,
        stems: Object.keys(d.matchData.metadata),
      };
    });
    setSearchResultsData(searchResults);
  }

  // load the matching interviews
  useEffect(() => {
    if (idx && completedSearchFor !== searchFor  && searchResultsData.length > 0) {
      const toLoad: string[] = searchResultsData
        .map((sr: SearchResult): string => sr.file)
        .filter((file: string, idx: number, self: string[]) => self.indexOf(file) === idx);
      const loadInterviews = async (files: string[]) => {
        const transcripts: Transcript[] = await Promise.all(
          files.map(async (file: string) => {
            const fileResponse = await fetch(`${process.env.PUBLIC_URL}/static/interviews/${file}`);
            const transcript = await fileResponse.json();
            return {
              file,
              transcript,
            }
          })
        );
        // add to search results
        // and aggregate the results grouping by interview and part
        const results: SearchResultWithTranscript[] = [];
        searchResultsData.forEach((sr: SearchResult, srIdx: number) => {
          const transcript: Transcript = transcripts.find(t => t.file === sr.file);
          sr.text = transcript.transcript[sr.timestamp][sr.pIdx];

          const resultIdx = results.findIndex(t => t.citation === sr.citation);
          if (resultIdx === -1) {
            results.push({
              citation: sr.citation,
              photographerKey: sr.photographerKey,
              citationMetadata: sr.citationMetadata,
              score: sr.score,
              parts: [{
                file: sr.file,
                interviewIdx: sr.interviewIdx,
                matches: [{
                  timestamp: sr.timestamp,
                  texts: [transcript.transcript[sr.timestamp][sr.pIdx]],
                  stems: sr.stems,
                }],
              }]
            })
          } else {
            results[resultIdx].score += sr.score;
            const partIdx = results[resultIdx].parts.findIndex(p => p.file === sr.file);
            if (partIdx === -1) {
              results[resultIdx].parts.push({
                file: sr.file,
                interviewIdx: sr.interviewIdx,
                matches: [{
                  timestamp: sr.timestamp,
                  texts: [transcript.transcript[sr.timestamp][sr.pIdx]],
                  stems: sr.stems,
                }],
              });
            } else {
              const matchIdx = results[resultIdx].parts[partIdx].matches.findIndex(r => r.timestamp === sr.timestamp);
              if (matchIdx === -1) {
                results[resultIdx].parts[partIdx].matches.push({
                  timestamp: sr.timestamp,
                  texts: [transcript.transcript[sr.timestamp][sr.pIdx]],
                  stems: sr.stems,
                });
              } else {
                results[resultIdx].parts[partIdx].matches[matchIdx].texts.push(transcript.transcript[sr.timestamp][sr.pIdx]);
              }
            }
          }
        });

        // sort matches by order
        results.forEach((result: SearchResultWithTranscript) => {
          result.parts = result.parts.sort((a, b) => a.interviewIdx - b.interviewIdx);
          result.parts.forEach(part => {
            part.matches = part.matches.sort((a, b) => a.timestamp - b.timestamp);
          });
        });

        setResults(results.sort((a, b) => b.score - a.score));
        setCompletedSearchFor(searchFor);
      };


      const transcripts = loadInterviews(toLoad);
    }
  });

  if (!idx) {
    return (<div>no index loaded</div>);
  }

  const getKIC = (texts: string[], terms: string[]) => {
    const keywordsInContext: string[] = [];
    texts.forEach(str => {
      const rawseq = str.split(' ');
      let lastEnd = -1;
      rawseq.forEach((word, j) => {
        if (terms.some((term: string) => word.toLowerCase().includes(term)) && j > lastEnd) {
        //if (word.toLowerCase().some(terms => searchFor.toLowerCase()) && j > lastEnd) {
          const wordsToPad = 20;
          const begin = (j - wordsToPad > 0) ? j - wordsToPad : 0;
          const end = (j + wordsToPad < rawseq.length) ? j + wordsToPad - 1 : rawseq.length;
          const seq = rawseq.slice(begin, end);
          lastEnd = end;
          if (begin > 0) {
            seq[0] = `... ${seq[0]}`;
          }
          if (end < rawseq.length - 1) {
            seq[seq.length - 1] = `${seq[seq.length - 1]} ...`;
          }
          keywordsInContext.push(seq.join(' '));
        }
      });
    })
    return keywordsInContext;
  };

  return (
    <div>
      <Link
        to='/photographers'
        className='ohControls'
      >
        <CloseButton />
      </Link>
      <div id='ohSearch'>
        <h2>Search the Oral Histories</h2>
        <OralHistoriesSearchForm
          searchFor={searchFor}
        />
        <div id='interviewResults'>
          {(results.length === 0) && (
            <div> 
              {`${searchFor} not found` }
            </div>
          )}
          {results.map((i: SearchResultWithTranscript) => (
            <div
              key={i.photographerKey}
            >
              <Link
                to={`/photographers/${i.photographerKey}`}
              >
                <h4>
                  {i.citation}
                </h4>
                <h5>
                  {i.citationMetadata}
                </h5>
              </Link>

              {i.parts.map(p => (
                <div key={p.interviewIdx}>
                  <h5>
                    {`Part ${p.interviewIdx + 1}`}
                  </h5>

                  {p.matches.map(m => (
                    <Link
                      to={`/photographers/${i.photographerKey}/${p.interviewIdx}/${m.timestamp}/${searchFor}`}
                      key={m.timestamp}
                    >
                      <InterviewTimestamp
                        timestamp={m.timestamp}
                        paragraphs={getKIC(m.texts, searchFor.split(' ').concat(m.stems))}
                        highlight={searchFor.split(' ').concat(m.stems)}
                      />
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OralHistoriesSearch;
