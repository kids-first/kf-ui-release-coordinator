import {combineReducers} from 'redux';
import {combineForms} from 'react-redux-form';
import auth from './auth';
import releases from './releases';
import studies from './studies';

export default combineReducers({
  auth,
  releases,
  studies,
  releaseForm: combineForms({
    studies: [],
    title: '',
    isMajor: 'false',
  }),
});
