import { MakeLink } from '../index.d';

export interface Props {
  timeRange: [number, number];
  width: number;
  marginLeft: number;
  setTimeRange: (timeRange: [number, number]) => void;
  makeLink: MakeLink;
}
