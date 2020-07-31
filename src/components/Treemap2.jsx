import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from "react-router-dom";
import Async from "react-async";
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import TreemapTheme from './TreemapTheme2.jsx';
import { buildLink } from '../helpers.js';
import './Treemap.css';

const loadThemes = async ({ fetchPath, photosQuery }, { signal }) => {
  const responses = await Promise.all([
    fetch(fetchPath, { signal }),
    fetch(photosQuery, { signal })
  ]); ;
  if (responses.some(res => !res.ok)) { console.log(res) }
  return {
    themes: await responses[0].json(),
    photoSrc: await responses[1].json(),
  };
}

const formatThemes = (data, timeRange, selectedTheme, selectedPhotographerName, dimensions, filterTerms) => {
  // if the data comes from carto you need to do a bit of reformatting/organization
  let themesData = { total: 0, children: {} };
  if (data.themes.rows) {
    const { rows } = data.themes;
    if (rows.length > 0) {
      rows.forEach(theme => {
        const { vanderbilt_level1: level1, vanderbilt_level2: level2, vanderbilt_level3: level3, total } = theme;
        themesData.children[level1] = themesData.children[level1] || {
          total: 0,
          children: {},
        };
        themesData.children[level1].total += total;
        themesData.children[level1].children[level2] = themesData.children[level1].children[level2] || {
          total: 0,
          children: {},
        };
        themesData.children[level1].children[level2].children[level3] = themesData.children[level1].children[level2].children[level3] || {
          total: 0,
        };
        themesData.total += total;
        themesData.children[level1].total += total;
        themesData.children[level1].children[level2].total += total;
        themesData.children[level1].children[level2].children[level3].total += total;
      });
    }
  } else {
    themesData = data.themes.themes;
  }

  let photos = data.photoSrc.rows;

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
  let rawThemes = {};
  if (themesPaths.length === 0) {
    rawThemes = themesData.children;
  } else if (themesPaths.length === 1) {
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
  const organizedThemeData = {
    name: selectedTheme,
    children: Object.keys(rawThemes).map(theme => {
      let photoCount = rawThemes[theme].total;
      if ((!filterTerms || filterTerms.length === 0) && (startTime > 193501 || endTime < 194504)) {
        photoCount = Object
          .keys(rawThemes[theme])
          .filter(k => {
            if (k === 'total' || k === 'photographers') {
              return false;
            }
            return k.substring(1) >= startTime && k.substring(1) <= endTime;
          })
          .reduce((accumulator, k) => {
            return rawThemes[theme][k] + accumulator;
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
    .sum(d => d.value)
    .sort((a, b) => {
      let order;
      if (selectedTheme === 'root') {
        order = ["Work", "People As Such", "Homes and Living Conditions", "Cities and Towns", "Social and Personal Activity", "The Land", "Transportation", "War", "Organized Society", "Religion", "Medicine and Health", "Itellectual and Creative Activity", "Alphabetical Section"];
        return order.indexOf(a.data.name) - order.indexOf(b.data.name);
      }
      return b.value - a.value
    });
  const treemap = d3.treemap().tile(d3.treemapSquarify.ratio(1))(themesHierarchy);

  const themesCoords = (treemap && treemap.children && treemap.children.length > 0)
    ? treemap.children.map((child, idx) => {
    // make the id--those on the bottom of the hierarchy need to be adjusted if they're selected to be their immediate ancestor
    const id = (themesPaths.length <= 2) ? `${selectedTheme}|${child.data.name}` : `root|${themesPaths.slice(0, themesPaths.length - 1).join('|')}|${child.data.name}`;

    // style for selection at the bottom level
    let strokeWidth = width / 200;
    let fontColor = 'white';
    let fillOpacity = 0.11;
    let link = id;
    let fill = color(child.data.name);
    if (themesPaths.length === 3 && selectedTheme && selectedTheme !== id) {
      fontColor = '#aaa';
      fillOpacity = 0.22;
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
    };
    })
    : [];

  return {
    name,
    themes: themesCoords,
    ancestors: themesPaths.slice(0, topLevel - 1).map((theme, idx) => ({
        name: theme,
        key: ['root'].concat(themesPaths.slice(0, idx + 1)).join('|'),
      })),
  };
}

const Treemap = ({ timeRange, filterTerms, dimensions, height, width, selectedTheme, fetchPath, photosQuery }) => {
  const ref = useRef();

  return (
    <Async
      promiseFn={loadThemes}
      fetchPath={fetchPath}
      photosQuery={photosQuery}
      watch={fetchPath}
    >
      {({ data, error, isPending }) => {
        if (isPending) return "Loading...";
        if (error) return `Something went wrong: ${error.message}`;
        if (data) {
          const { themes, name, ancestors } = formatThemes(data, timeRange, selectedTheme, null, dimensions, filterTerms);
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
                      to={`/themes`}
                    >
                      Top
                    </Link>
                  </li>
                }
                {ancestors.map(ancestor => (
                  <li
                    key={ancestor.key}
                  >
                    <Link
                      to={`/themes/${ancestor.key}`}
                    >
                      {ancestor.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {themes.map(cat => (
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

Treemap.propTypes = {
};
 Treemap.defaultProps = {
  
};
