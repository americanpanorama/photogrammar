import { MutableRefObject } from 'react';
import { PhotoCardsDimensions, PhotoMetadata } from '../../index.d';

export interface Props {
  query: string;
  sidebarPhotosOffset: number;
  photoSetId: string;
  displayableCards: number;
  sidebarWidth: number;
  cardDimensions: PhotoCardsDimensions;
}

export interface AsyncFetch {
  rows: PhotoMetadata[];
}

export interface PhotoSet {
  photos: PhotoMetadata[];
  blankCards: string[];
  translateX: number;
  offset: number, 
  ref: MutableRefObject<HTMLDivElement>,
}
