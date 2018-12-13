import {coordinatorApi} from '../globalConfig';
import axios from 'axios';

export function releasesPageLoading(loading) {
  return {
    type: 'RELEASES_PAGE_LOADING',
    loading,
  };
}

export function releasesPageError(hasError, err) {
  console.log(err);
  return {
    type: 'RELEASES_PAGE_ERROR',
    hasError: hasError,
  };
}

export function releasesPageSuccess(response) {
  console.log(response);
  return {
    type: 'RELEASES_PAGE_SUCCESS',
    data: response,
  };
}

export function fetchPageOfReleases(page, filters) {
  return dispatch => {
    dispatch(releasesPageLoading(true));

    axios
      .get(`${coordinatorApi}/releases`)
      .then(response => {
        dispatch(releasesPageLoading(false));
        if (response.status !== 200) {
          throw Error(response);
        }
        return response;
      })
      .then(response => {
        dispatch(releasesPageSuccess(response.data));
      })
      .catch(err =>
        dispatch(releasesPageError(true, err)),
      );
  };
}
