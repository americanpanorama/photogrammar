import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Async from "react-async";
import * as d3 from 'd3';
import Photographers from '../../data/photographers.json';
import { monthNum, getTimeCode  } from '../helpers.js';
import Row from './TimelineRow';
import './Timeline.css';
import { MonthTotal, TimelineRow } from '../index.d';
import { Props, DBData } from './Timeline.d';

const loadTimelineCells = async ({ fetchPath }: { fetchPath: string}) => {
  const res = await fetch(fetchPath);
  if (!res.ok) { console.log(res) }
  const rawData: MonthTotal[] | DBData = await res.json();
  const isDBData = (data: MonthTotal[] | DBData): data is DBData => (data as DBData).rows !== undefined;
  if (isDBData(rawData)) {
    return rawData.rows;
  } 
  return rawData;
}

const TimelineHeatmap = (props: Props) => {
  const {
    fetchPath,
    selectedPhotographer,
    timeRange,
    baseColor,
    leftAxisWidth,
    width,
    height,
    labelsWidth,
    makeLink,
  } = props;

  const [showOthers, setShowOthers] = useState(false);
  const [hoveredPhotographer, setHoveredPhotographer] = useState(null);

  const clearLink = makeLink([{ type: 'clear_photographer' }]);

  // this will close the other photographers if one is selected
  const otherPhotographerSelected = useRef(selectedPhotographer);
  if (selectedPhotographer && selectedPhotographer !== otherPhotographerSelected.current) {
    // only close if it's an other photographer
    const { count } = Photographers.find(p => p.key === selectedPhotographer);
    if (count < 500) {
      otherPhotographerSelected.current = selectedPhotographer;
      setShowOthers(false);
    }
  }

  const onHover = (photographerKey: string): void => {
    if (hoveredPhotographer !== photographerKey) {
      setHoveredPhotographer(photographerKey);
    }
  };

  const onUnhover = (): void => {
    if (hoveredPhotographer) {
      setHoveredPhotographer(null);
    }
  };

  const formatPhotographers = (monthTotals: MonthTotal[]): TimelineRow[] => {
    // calculate the witeh of the month/cell
    const x = d3.scaleLinear()
      .domain([1935, 1944 + monthNum(6)])
      .range([leftAxisWidth + labelsWidth, width + leftAxisWidth]);
    const monthWidth = x(1935 + monthNum(2)) - x(1935);

    const threshold = 500;
    // organize a list of the photographers with some basic display info
    const rows: Partial<TimelineRow>[] = Photographers
      // drop BarbaraEvans and OttoGilmore, who uniquely have more than 75 photos but none with a month
      .filter(p => p.count >= 75 && p.key && p.key !== 'unspecified' && p.key !== 'NA' && p.key !== "BarbaraWright" && p.key !== "OttoGilmore")
      // sort in a couple of ways: first divided between those who shot less than 500 photos and then for each of those groups by the date they took their first shot
      .sort((a, b) => {
        if (a.count < threshold && b.count >= threshold) {
          return -1;
        }
        if (a.count >= threshold && b.count < threshold) {
          return 1;
        }
        if (a.firstDate !== b.firstDate) {
          return (a.count >= threshold) ? a.firstDate - b.firstDate : b.firstDate - a.firstDate;
        }
        if (a.lastDate != b.lastDate) {
          return (a.count >= threshold) ? a.lastDate - b.lastDate : b.lastDate - a.lastDate;
        }
        return 0;
      })
      .map(p => {
        const active = (monthTotals.map(tc => tc.pk).includes(p.key)
          && timeRange[1] > p.firstDate && timeRange[0] < p.lastDate);
        let fill = (active) ? 'black' : '#eee';
        if ((selectedPhotographer) && active && p.key !== selectedPhotographer && p.key !== hoveredPhotographer) {
          fill = '#777';
        }
        return {
          label: `${p.firstname} ${p.lastname}`,
          photographerKey: p.key,
          firstDate: p.firstDate,
          lastDate: p.lastDate,
          months: [],
          active,
          fill,
          monthWidth,
          linkTo: makeLink([{ type: 'set_photographer', payload: p.key }]),
          isOther: p.count < threshold,
        };
      });

    // use the rows to calculate the height variable for the timeline visualizatoin
    const numberAboveThreshold = rows.filter(p => !p.isOther).length;
    const numberBelowThreshold = rows.filter(p => p.isOther).length;
    // the +/-2 here are to leave room for the collective "other photographers" when they aren't individual shown
    const rowHeight = height / (numberAboveThreshold + 3);
    const translateY = -1 * rowHeight * (numberBelowThreshold);
    const monthHeight = rowHeight - 2;

    // the +3 here is for an empty row for the "other photographers" to separate the two visually
    const y = d3.scaleLinear()
      .domain([0, rows.length + 3])
      .range([0, height - translateY]);

    // add the month data (cell) to each row (photographers)
    monthTotals.forEach((tc: MonthTotal): void => {
      const idx = rows.findIndex(p => p.photographerKey === tc.pk);
      const opacityDenominator = 350; //Math.min(250, Math.max(...filteredCells.map(tc => tc.count)));
      const inSelection = (!(getTimeCode(tc.y, tc.m) < timeRange[0]
        || getTimeCode(tc.y, tc.m) > timeRange[1])
        && ((!selectedPhotographer && !hoveredPhotographer) || selectedPhotographer === tc.pk || hoveredPhotographer === tc.pk));
      if (idx !== -1) {
        const cell = {
          year: tc.y,
          month: tc.m,
          count: tc.t,
          x: x(tc.y + monthNum(tc.m)),
          fill: (inSelection) ? baseColor : '#eeeeee',
          inSelection,
          fillOpacity: (tc.t > 0) ? 0.1 + 0.9 * tc.t / opacityDenominator : 0,
          width: monthWidth,
          height: monthHeight,
        }
        rows[idx].months.push(cell);
      }
    });

    // sort the cells in chronological order
    rows.forEach(d => {
      d.months = d.months.sort((a, b) => getTimeCode(a.year, a.month) - getTimeCode(b.year, b.month));
    });

    // add the y, labelX, and yeartick values for each photographer
    rows.forEach((d, i) => {
      let yCoord;
      if (!d.isOther) {
        yCoord = y(i + 3) + 1;
      } else {
        if (showOthers) {
          yCoord = y(i) + 1;
        } else {
          // if the others are collapsed, they appear in a single line overlaying one another, except it one is selected, then they appear below all the overlayed "others"
          yCoord = (selectedPhotographer === d.photographerKey) ? translateY * -1 + monthHeight * 2 : translateY * -1;
        }
      }
      rows[i].y = yCoord;
      rows[i].ySelectable = (!d.isOther) ? y(i + 3) + 1 : y(i) + 1;
      rows[i].labelX = x(1935) - 5; //x(Math.floor(d.firstDate / 100)) - 5;
      rows[i].yearTicks = [];
      [1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945].forEach(y => {
        if (!d.isOther || y >= Math.floor(d.firstDate / 100)) {
          let stroke = 'black';
          // lighten if it's before rows first data
          if (y < Math.floor(d.firstDate / 100)) {
            stroke = '#ddd';
          }
          // or if it's not within the time range
          if (y * 100 + 1 < timeRange[0] || y * 100 > timeRange[1]) {
            stroke = '#ddd';
          }
          rows[i].yearTicks.push({
            x: x(y) - 0.25,
            stroke,
            monthHeight
          });
        }
      });
    });    

    // sort the photographers so that selected and hovered photographers are last and overlap the rest when painted
    const sortedRows= [
      ...rows.filter(p => p.photographerKey !== selectedPhotographer && p.photographerKey !== hoveredPhotographer),
      ...rows.filter(p => p.photographerKey === selectedPhotographer && p.photographerKey !== hoveredPhotographer),
      ...rows.filter(p => p.photographerKey === hoveredPhotographer),
    ];

    return sortedRows as TimelineRow[];
  }
  
  return (
    <Async
      promiseFn={loadTimelineCells}
      fetchPath={fetchPath}
      watch={fetchPath}
    >
      {({ data, error, isPending }) => {
        //if (isPending) return "Loading..."
        if (error) return `Something went wrong with the timeline: ${error.message}`
        if (data) {
          const rows = formatPhotographers(data);

          // use the rows to calculate the height variable for the timeline visualizatoin
          const numberAboveThreshold = rows.filter(p => !p.isOther).length;
          const numberBelowThreshold = rows.filter(p => p.isOther).length;
          // the +/-2 here are to leave room for the collective "other photographers" when they aren't individual shown
          const rowHeight = height / (numberAboveThreshold + 3);
          const translateY = -1 * rowHeight * (numberBelowThreshold);
          const monthHeight = rowHeight - 2;
          const labelSize = Math.min(monthHeight * 1.4, rows[0].monthWidth * 2.5);

          const svgheight = height - translateY + 20;
          const paddingTop = 20;
          return (
            <div
              className='timeline'
              style={{
                overflowY: (showOthers) ? 'visible' : 'hidden',
                height: height,
                zIndex: 1001,
              }}
            >
              <div
                style={{
                  transform: `translateY(${translateY - paddingTop}px)`,
                  backgroundColor: 'rgba(255, 255, 255, 0.97)',
                  paddingTop,
                }}
              >
                <svg
                  width={width + leftAxisWidth}
                  height={svgheight}
                >
                {/* tip and control to clear photographer */}
                  <g
                    transform={`translate(${leftAxisWidth} ${svgheight - 200})`}
                  >
                    {(selectedPhotographer) ? (
                      <Link
                        to={clearLink}
                      >
                        <g transform={'translate(-15 0)'}>
                          <line
                            x1={-8}
                            x2={8}
                            y1={-8}
                            y2={8}
                            strokeWidth={18 / 9}
                            stroke='black'
                          />
                          <line
                            x1={-8}
                            x2={8}
                            y1={8}
                            y2={-8}
                            strokeWidth={18 / 9}
                            stroke='black'
                          />
                        </g>
                        <text
                          x={-30}
                          y={0}
                          textAnchor='end'
                          fontSize={15}
                        >
                          <tspan>
                            clear selected
                          </tspan>
                          <tspan
                            x={-30}
                            dy={svgheight / rows.length * 1.75}
                          >
                            photographer
                          </tspan>
                        </text>
                      </Link>
                    ) : (
                      <text
                        x={-15}
                        y={0}
                        textAnchor='end'
                        fontSize={Math.min(18, svgheight / rows.length * 1.25)}
                        className='tip'
                      >
                        <tspan>
                          To select a photographer
                        </tspan>
                        <tspan
                          x={-15}
                          dy={15}
                        >
                          click on their name
                        </tspan>
                      </text>
                    )}
                  </g>

                  {/* the legend */}
                  <g
                    transform={`translate(${leftAxisWidth /2} ${svgheight - 125})`}
                    className='legend'
                  >
                    <text
                      textAnchor='middle'
                      fontSize={Math.min(16, monthHeight * 1.2)}
                      y={monthHeight * 2.5 + Math.min(40, monthHeight * 2.5)}
                      fill='#666'
                    >
                      # of photos taken each month
                    </text> 

                    <defs>
                      <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"
                          style={{
                            stopOpacity: 0.1,
                          }}
                        />
                        <stop offset="100%" 
                          style={{
                            stopOpacity: 1,
                          }} />
                      </linearGradient>
                    </defs>

                    <rect 
                      x={leftAxisWidth * -1 / 4}
                      y={monthHeight * 1}
                      width={leftAxisWidth * 2 / 4}
                      height={monthHeight * 1.5}
                      fill="url(#legendGrad)"
                    />

                    <g
                      className='axis'
                      transform={`translate(0 ${monthHeight * 2.5 + Math.min(18, monthHeight * 1.25)})`}
                    >
                      <text
                        fontSize={Math.min(16, monthHeight * 1.2)}
                        x={leftAxisWidth * -1 / 4}
                      >
                        0
                      </text>
                      <text
                        fontSize={Math.min(16, monthHeight * 1.2)}
                      >
                        175
                      </text>
                      <text
                        x={leftAxisWidth * 1 / 4}
                        fontSize={Math.min(16, monthHeight * 1.2)}
                      >
                        350+
                      </text>
                    </g>
                  </g>

                  <text
                    x={leftAxisWidth + labelsWidth - 2}
                    y={monthHeight - translateY}
                    textAnchor='end'
                    onClick={() => setShowOthers(!showOthers)}
                    fontSize={monthHeight * 1.2}
                    style={{ cursor: 'pointer' }}
                  >
                    {(showOthers) ? 'collapse other photographers' : 'other photographers'}
                  </text>

                  {rows.map(p => (
                    <Row
                      {...p}
                      showLabel={(!p.isOther || selectedPhotographer === p.photographerKey || showOthers)}
                      emphasize={(selectedPhotographer && selectedPhotographer === p.photographerKey) || (hoveredPhotographer && hoveredPhotographer === p.photographerKey)}
                      photographerKey={p.photographerKey}
                      monthWidth={p.monthWidth}
                      monthHeight={monthHeight}
                      labelSize={labelSize}
                      key={`timelineRowFor${p.photographerKey}`}
                      onHover={onHover}
                      onUnhover={onUnhover}
                    />
                  ))}
                </svg>
              </div>
            </div>
          );
        }
      }}
    </Async>
  );
};

export default TimelineHeatmap;
