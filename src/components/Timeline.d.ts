import { MakeLink, MonthTotal } from '../index.d';

export interface Props {
  fetchPath: string;
  selectedPhotographer: string;
  timeRange: [number, number];
  baseColor: string;
  leftAxisWidth: number;
  width: number;
  height: number;
  labelsWidth: number;
  makeLink: MakeLink;
}

export interface DBData {
  rows: MonthTotal[];
}
