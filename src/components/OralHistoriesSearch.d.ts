export interface Params {
  searchFor: string;
}

export interface LunrSearchResult {
  ref: string;                  //
  matchData: {
    metadata: {
      [index: string]: {
        [index: string]: any;
      };
    };
  };
  score: number;
}

export interface TimestampTranscription {
  [index: string]: string[];
}

export interface Transcript {
  file: string;
  transcript: TimestampTranscription;
  text?: string;
}

export interface SearchResult {
  file: string;
  timestamp: number;
  pIdx: number;
  photographerKey: string;
  interviewIdx: number;
  citation: string;
  citationMetadata: string;
  key: string;
  text: string | null;
  score: number;
  stems: string[];
}

export interface SearchResultWithTranscript {
  citation: string;
  photographerKey: string;
  citationMetadata: string;
  score: number;
  parts: {
    file: string;
    interviewIdx: number;
    matches: {
      timestamp: number;
      texts: string[];
      stems: string[];
    }[];
  }[];
}
