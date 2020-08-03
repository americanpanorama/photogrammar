import { useLocation } from 'react-router-dom';
import Centroids from '../data/centroids.json';

export function buildLinkREMOVE (options, location) {
  const pathname = (location) ? location.pathname : useLocation().pathname;
  const hash = (location) ? location.hash : useLocation().hash;

  const replaceOrAdd = options.replaceOrAdd || [];
  const replace = options.replace || [];
  const keep = options.keep || [];
  const params = parsePathname(pathname);

  const remove = options.remove || []; 

  if (!keep.includes('photo')) {
    remove.push('photo');
  }

  if (replaceOrAdd.map(r => r.param).includes('county')) {
    remove.push('city');
    remove.push('state');
    remove.push('maps');
  }
  if (replaceOrAdd.map(r => r.param).includes('city')) {
    remove.push('county');
    remove.push('state');
    remove.push('maps');
  }
  if (replaceOrAdd.map(r => r.param).includes('state')) {
    remove.push('city');
    remove.push('county');
    remove.push('maps');
  }
  if (replaceOrAdd.map(r => r.param).includes('maps')) {
    remove.push('city');
    remove.push('county');
    remove.push('maps');
  }

  // order matters for the selected viz, so use the existing link to calculate which param to list first
  const firstKey = (pathname !== '/') ? pathname.match(/\/([^/]+)/)[1] : 'maps';
  let firsts = (options.viz) ? [options.viz] : [];
  if (firsts.length === 0) {
    if (firstKey === 'themes') {
      firsts.push('themes');
    }
    if (['county', 'city'].includes(firstKey)
      && replace.some(r => ['county', 'city'].includes(r.param) && r.withParam === 'state')) {
      firsts.push('state');
    }
    if (firstKey === 'state' && replace.some(r => r.param === 'state' && r.withParam === 'county')) {
      firsts.push('county');
    }
    if (firstKey === 'state' && replace.some(r => r.param === 'state' && r.withParam === 'city')) {
      firsts.push('city');
    }
    if (['state', 'county', 'city'].includes(firstKey) && remove.includes('state')) {
      params.maps = null;
      firsts.push('maps');
    }
    if (firstKey === 'maps'
      && replace.some(r => r.param === 'maps' && ['state', 'county', 'city'].includes(r.withParam))) {
      firsts.push(replace.find(r => r.param === 'maps').withParam);
    }
  }

  remove.forEach(r => {
    delete params[r || r.param];
  });

  replaceOrAdd.forEach(r => {
    if (r.withParam) {
      params[r.withParam] = r.value;
      delete params[r.param];
    } else if (r.param) {
      params[r.param] = r.value;
    }
  });

  replace.forEach(r => {
    if (r.withParam && r.param) {
      params[r.withParam] = r.value;
      delete params[r.param];
    } else if (r.param) {
      params[r.param] = r.value;
    }
  });

  if (params.photo) {
    firsts.unshift('photo');
  }

  let newPath = '';
  firsts.forEach(paramKey => {
    newPath = `${newPath}/${paramKey}${(params[paramKey]) ? `/${params[paramKey]}` : ''}`;
  });
  Object
    .keys(params)
    .filter(paramKey => !firsts.includes(paramKey) && !(paramKey === 'themes' && params[paramKey] === 'root'))
    .forEach(paramKey => {
      newPath = `${newPath}/${paramKey}${(params[paramKey]) ? `/${params[paramKey]}` : ''}`;
    });
  // if (params.photo) {
  //   newPath = `${newPath}`;
  // }

  return `${newPath}${hash || ''}`;
}

export function parsePathname(pathname) {
  // remove the basename from the pathPieces and build an object with state parameters
  const pathPieces = pathname.split('/').filter(param => param);
  const isParamKey = (param) => ['photo', 'photographers', 'ohsearch', 'themes', 'timeline', 'city', 'county', 'state', 'maps', 'caption'].includes(param);
  const stateParams = {};
  pathPieces.forEach((pathPiece, idx) => {
    if (isParamKey(pathPiece)) {
      if (pathPiece === 'themes' && isParamKey(pathPieces[idx + 1])) {
        stateParams[pathPiece] = 'root';
      } else if (pathPiece === 'photo') { // an exception as the id can contain a slash
        stateParams[pathPiece] = (!isParamKey(pathPieces[idx + 1])) ? `${pathPieces[idx + 1]}${(!isParamKey(pathPieces[idx + 2])) ? `/${pathPieces[idx + 2]}` : '' }` : null;
      } else {
        stateParams[pathPiece] = (!isParamKey(pathPieces[idx + 1])) ? pathPieces[idx + 1] : null;
      }
    }
  });
  stateParams.themes = stateParams.themes || 'root';
  return stateParams;
}

export const getCentroidForCounty = (nhgis_join) => Centroids.counties[nhgis_join];
