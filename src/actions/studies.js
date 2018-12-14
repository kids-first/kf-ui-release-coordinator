import {coordinatorApi} from '../globalConfig';
import axios from 'axios';

export function studiesPageLoading(loading, page) {
  return {
    type: 'STUDIES_PAGE_LOADING',
    loading,
    page,
  };
}

export function studiesPageError(hasError, err, page) {
  return {
    type: 'STUDIES_PAGE_ERROR',
    hasError: hasError,
    page,
  };
}

export function studiesPageSuccess(response, page) {
  return {
    type: 'STUDIES_PAGE_SUCCESS',
    data: response,
    page,
  };
}

export function fetchAllStudies(page, filters) {
  return dispatch => {
    dispatch(studiesPageLoading(true, page));

    axios
      .get(`${coordinatorApi}/studies?limit=10&offset=${(page - 1) * 10}`)
      .then(response => {
        dispatch(studiesPageLoading(false, page));
        if (response.status !== 200) {
          throw Error(response);
        }
        return response;
      })
      .then(response => {
        dispatch(studiesPageSuccess(response.data, page));
        return response;
      })
      .then(response => {
        if (response.data.next) {
          dispatch(fetchAllStudies(page + 1, filters));
        }
        return response;
      })
      .catch(err => dispatch(studiesPageError(true, err, page)));
  };
}
