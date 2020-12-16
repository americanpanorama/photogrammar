import { PhotographerMetadata } from '../index.d';

export interface Props {
  selectedPhotographerData: PhotographerMetadata;
  expandedSidebar: boolean; 
}

export interface Params {
  photographerKey: string;
  interviewKey: string | null;
  timestampKey: string | null;
  highlight: string | null;
}
