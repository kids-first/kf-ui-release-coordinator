import {coordinatorApi} from '../globalConfig';
import axios from 'axios';

export function releasesPageLoading(loading, page) {
  return {
    type: 'RELEASES_PAGE_LOADING',
    loading,
    page,
  };
}

export function releasesPageError(hasError, err, page) {
  return {
    type: 'RELEASES_PAGE_ERROR',
    hasError: hasError,
    page,
  };
}

export function releasesPageSuccess(response, page) {
  return {
    type: 'RELEASES_PAGE_SUCCESS',
    data: response,
    page,
  };
}

export function fetchAllReleases(page, filters) {
  return dispatch => {
    dispatch(releasesPageLoading(true, page));

    axios
      .get(`${coordinatorApi}/releases?limit=10&offset=${(page - 1) * 10}`)
      .then(response => {
        dispatch(releasesPageLoading(false, page));
        if (response.status !== 200) {
          throw Error(response);
        }
        return response;
      })
      .then(response => {
        dispatch(releasesPageSuccess(response.data, page));
        return response;
      })
      .then(response => {
        if (response.data.next) {
          dispatch(fetchAllReleases(page + 1, filters));
        }
        return response;
      })
      .catch(err => dispatch(releasesPageError(true, err, page)));
  };
}
