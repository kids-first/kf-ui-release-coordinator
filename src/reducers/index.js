import { combineReducers } from 'redux';
import releases from './releases';
import studies from './studies';

export default combineReducers({
  releases,
  studies,
})
