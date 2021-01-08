import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import initialState from './initialState';
import { createLogger } from 'redux-logger';

const hashManager = store => next => (action) => {
  const theNext = next(action);
  const nextState = store.getState();
  const {
    selectedMapView,
  } = store.getState();
  const newHash = {
    mapview: null, 
  };
  if (selectedMapView === 'cities') {
    newHash.mapview = 'cities';
  }
  const hash = `#${Object.keys(newHash)
    .filter(k => newHash[k] !== null && newHash[k] !== '')
    .map(k => `${k}=${newHash[k]}`).join('&')}`;
  if (document.location.hash !== hash) {
    document.location.assign(hash);
  }
  return theNext;
};

const logger = createLogger({
  collapsed: true,
  duration: true,
});

export default function configureStore() {
 return createStore(
   reducers,
   initialState,
   applyMiddleware(thunk)
 );
}
