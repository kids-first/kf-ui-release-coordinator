import {combineReducers} from 'redux';
import {combineForms} from 'react-redux-form';
import releases from './releases';
import studies from './studies';

export default combineReducers({
  releases,
  studies,
  releaseForm: combineForms({
    studies: [],
    title: '',
    isMajor: false,
  }),
});
