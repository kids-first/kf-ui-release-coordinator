import {combineReducers} from 'redux';
import {modelReducer, formReducer, combineForms} from 'react-redux-form';
import releases from './releases';
import studies from './studies';

export default combineReducers({
  releases,
  studies,
  releaseForm: combineForms({
    studies: [],
    title: null,
    isMajor: false,
  }),
});
