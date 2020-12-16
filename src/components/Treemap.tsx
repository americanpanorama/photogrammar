import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from "react-router-dom";
import Async from "react-async";
import * as d3 from 'd3';
import TreemapTheme from './TreemapTheme';
import { TreemapProps, ThemePhoto, AsyncParams, Dimensions, Theme, TreemapThemeProps } from '../index.d';
import './Treemap.css';

interface OrganizedTheme {
  name: string;
  children: {
    name: string;
    key: string;
    value: number;
  }[];
}

interface ThemeAncestor {
  name: string;
  key: string;
}

interface TreemapNode {
  data: {
    name: string;
  };
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

const loadThemes = async ({ fetchPath, photosQuery }: { fetchPath: string; photosQuery: string; }) => {
  const responses = await Promise.all([
    fetch(fetchPath),
    fetch(photosQuery)
  ]);
  const rawThemes: any = await responses[0].json();
  // the local async data is already organized; if this is retrieved from carto (signaled by the `row` param) it needs to be organized
  let themes: Theme = {
    total: 0,
    children: {},
  };
  if (rawThemes.themes.rows) {
    const { rows } = rawThemes.themes;
    if (rows.length > 0) {
      rows.forEach((theme: {vanderbilt_level1: string, vanderbilt_level2: string, vanderbilt_level3: string, total: number}) => {
        const { vanderbilt_level1: level1, vanderbilt_level2: level2, vanderbilt_level3: level3, total } = theme;
        themes.children[level1] = themes.children[level1] || {
          total: 0,
          children: {},
        };
        themes.children[level1].total += total;
        themes.children[level1].children[level2] = themes.children[level1].children[level2] || {
          total: 0,
          children: {},
        };
        themes.children[level1].children[level2].children[level3] = themes.children[level1].children[level2].children[level3] || {
          total: 0,
        };
        themes.total += total;
        themes.children[level1].total += total;
        themes.children[level1].children[level2].total += total;
        themes.children[level1].children[level2].children[level3].total += total;
      });
    }
  } else {
    themes = rawThemes.themes;
  }
  const photoSrcData: { rows: ThemePhoto[] } = await responses[1].json();
  return {
    themes,
    photoSrc: photoSrcData.rows,
  };
}

const formatThemes = (data: { themes: Theme; photoSrc: ThemePhoto[]; }, timeRange: [number, number], selectedTheme: string, dimensions: Dimensions, filterTerms: string[], makeLink: any) => {
  let { photoSrc: photos, themes: themesData } = data;

  if (Object.keys(themesData).length === 0) {
    return { themes: [], ancestors: [] };
  }
  const { height, width } = dimensions.map;

  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([20, height]);
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const themesPaths = selectedTheme.split('|').slice(1);
  const topLevel = Math.min(themesPaths.length + 1, 3);
  const name = themesPaths[themesPaths.length - 1];
  let rawThemes = themesData.children;
  if (themesPaths.length === 1) {
    rawThemes = themesData.children[themesPaths[0]].children;
  } else if (themesPaths.length >= 2 ) {
    rawThemes = themesData.children[themesPaths[0]].children[themesPaths[1]].children;
  }

  const [startTime, endTime] = timeRange;

  if (startTime > 193501) {
    const startYear = Math.floor(startTime / 100);
    const startMonth = startTime % 100;
  }
  if (endTime < 194504) {
    const endYear = Math.floor(endTime / 100);
    const endMonth = endTime % 100;
  }

  // organize the data for d3
  const organizedThemeData: OrganizedTheme = {
    name: selectedTheme,
    children: Object.keys(rawThemes).map((theme: string) => {
      let photoCount = rawThemes[theme].total;
      // filter if this comes from the preposessed data files, which you can check by looking for a single month variable, e.g. m193506
      const hasMonthData = Object.keys(rawThemes[theme]).some(key => { return key.match(/m\d{6}/); });
      if ((!filterTerms || filterTerms.length === 0) && hasMonthData
        && (startTime > 193501 || endTime < 194504)) {
        photoCount = Object
          .keys(rawThemes[theme])
          .filter((k: string) => {
            if (k === 'total' || k === 'photographers') {
              return false;
            }
            return parseInt(k.substring(1)) >= startTime && parseInt(k.substring(1)) <= endTime;
          })
          .reduce((accumulator, k) => {
            return rawThemes[theme][k] as number + accumulator;
          }, 0);
      }
      return {
        name: theme,
        key: `${selectedTheme}|${theme}`,
        value: photoCount,
      };
    })
  };

  const themesHierarchy = d3.hierarchy(organizedThemeData)
    .sum((d: any) => d.value || 0)
    .sort((a, b) => {
      let order;
      if (selectedTheme === 'root') {
        order = ["Work", "People As Such", "Homes and Living Conditions", "Cities and Towns", "Social and Personal Activity", "The Land", "Transportation", "War", "Organized Society", "Religion", "Medicine and Health", "Itellectual and Creative Activity", "Alphabetical Section"];
        return order.indexOf(a.data.name) - order.indexOf(b.data.name);
      }
      return b.value - a.value
    });
  const treemap: any = d3.treemap().tile(d3.treemapSquarify.ratio(1))(themesHierarchy);

  const themesCoords = (treemap && treemap.children && treemap.children.length > 0)
    ? treemap.children.map((child: TreemapNode, idx: number) => {
      // make the id--those on the bottom of the hierarchy need to be adjusted if they're selected to be their immediate ancestor
      const id = (themesPaths.length <= 2) ? `${selectedTheme}|${child.data.name}` : `root|${themesPaths.slice(0, themesPaths.length - 1).join('|')}|${child.data.name}`;

      // style for selection at the bottom level
      let strokeWidth = width / 200;
      let fontColor = 'white';
      let fillOpacity = 0.11;
      let link = makeLink([{
        type: 'set_theme',
        payload: id,
      }]);
      let deemphasize = false;
      let fill = color(child.data.name);
      if (themesPaths.length === 3 && selectedTheme && selectedTheme !== id) {
        fontColor = '#ddd';
        fillOpacity = 0.22;
        deemphasize = true;
      }
      if (themesPaths.length === 3 && selectedTheme && selectedTheme === id) {
        link = id.substring(0, id.lastIndexOf('|'));
      }
      return {
        name: child.data.name,
        transformX: x(child.x0),
        transformY: y(child.y0),
        width: x(child.x1) - x(child.x0),
        height: y(child.y1) - y(child.y0),
        imgSrc: (photos.find(d => d.theme === child.data.name)) ? photos.find(d => d.theme === child.data.name).img : null,
        fill,
        fillOpacity,
        id,
        link,
        strokeWidth,
        fontColor,
        deemphasize,
      };
    }) : [];

  const ancestors: ThemeAncestor[] = themesPaths
      .slice(0, topLevel - 1)
      .map((theme: string, idx: number): ThemeAncestor => ({
        name: theme,
        key: ['root'].concat(themesPaths.slice(0, idx + 1)).join('|'),
      }));

  return {
    themes: themesCoords,
    ancestors, 
  };
}

const Treemap = (props: TreemapProps) => {
  const {
    timeRange,
    filterTerms,
    dimensions,
    selectedTheme,
    fetchPath,
    photosQuery,
    makeLink
  } = props;
  const { height, width } = dimensions.map;
  const ref = useRef();

  return (
    <Async
      promiseFn={loadThemes}
      fetchPath={fetchPath}
      photosQuery={photosQuery}
      watch={photosQuery}
    >
      {({ data, error, isPending }: AsyncParams) => {
        if (error) return `Something went wrong: ${error.message}`;
        if (data) {
          const { themes, ancestors } = formatThemes(data, timeRange, selectedTheme, dimensions, filterTerms, makeLink);
          const topLink = makeLink([{
            type: 'set_theme',
            payload: 'root',
          }]);
          return (
            <div
              className='treemap'
              style={{
                width: width,
                height: height,
                position: 'relative'
              }}
            >
              <ul className='breadcrumbs'>
                {(selectedTheme !== 'root') &&
                  <li>
                    <Link
                      to={topLink}
                    >
                      Top
                    </Link>
                  </li>
                }
                {ancestors.map(ancestor => {
                  const ancestorLink = makeLink([{
                    type: 'set_theme',
                    payload: ancestor.key,
                  }]);
                  return (
                    <li
                      key={ancestor.key}
                    >
                      <Link
                        to={ancestorLink}
                      >
                        {ancestor.name}
                      </Link>
                    </li>
                  );
                })}
                
              </ul>
              {themes.map((cat: TreemapThemeProps) => (
                  <TreemapTheme
                    {...cat}
                    key={cat.id}
                  />
              ))}

              <label
                className='explanation'
                title='Visualization of the classification system designed by Paul Vanderbilt in 1942. It is a three-tier classification starting with 12 main subject headings (ex. THE LAND), then 1300 sub-headings (ex. Mountains, Deserts, Foothills, Plains) and then sub-sub headings. 88,000 photographs were assigned classifications.'
              >
                1942 Classification System
              </label>

            </div>
          )
        }
      }}
    </Async>
  );
};

export default Treemap;
