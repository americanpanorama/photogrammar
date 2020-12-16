import { MouseEvent } from 'react';

export interface Props {
  query: string;
  hasFacet: boolean;
  displayableCards: number;
  sidebarPhotosOffset: number;
  previousOffset: number;
  nextOffset: number;
  setPhotoOffset: (event: MouseEvent<HTMLButtonElement>) => void;
  toggleExpandedSidebar: () => void;
  expandedSidebar: boolean;
  isMobile: boolean;
  timeRange: [number, number];
}

export interface QueryStats {
  count: number;
  mindate: number;
  maxdate: number;
}
