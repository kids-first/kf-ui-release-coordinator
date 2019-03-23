import {coordinatorApi} from '../globalConfig';
import {actions} from 'react-redux-form';
import axios from 'axios';

export function studiesSyncing(loading) {
  return {
    type: 'STUDIES_SYNCING',
    loading,
  };
}

export function studiesSyncSuccess(response) {
  return {
    type: 'STUDIES_SYNC_SUCCESS',
    data: response,
  };
}

export function studiesSyncError(hasError, error) {
  return {
    type: 'STUDIES_SYNC_ERROR',
    hasError,
    error,
  };
}

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

export function studySelect(studyId) {
  return {
    type: 'STUDY_SELECTED',
    studyId,
  };
}

export function studyDeselect(studyId) {
  return {
    type: 'STUDY_DESELECTED',
    studyId,
  };
}

export function studiesDeselectAll(selected) {
  return {
    type: 'STUDIES_DESELECTED',
    selected,
  };
}

export function studiesSelectAll(selected) {
  return {
    type: 'STUDIES_SELECTED',
    selected,
  };
}

export function syncStudies() {
  return dispatch => {
    dispatch(studiesSyncing(true));

    axios
      .post(`${coordinatorApi}/studies/sync`)
      .then(response => {
        dispatch(studiesSyncing(false));
        if (response.status !== 200) {
          throw Error(response);
        }
        return response;
      })
      .then(response => {
        dispatch(studiesSyncSuccess(response.data));
        return response;
      })
      .catch(err => {
        dispatch(studiesSyncError(true, err));
        dispatch(studiesSyncing(false));
      });
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

export function toggleStudy(key, shift, row) {
  return (dispatch, getState) => {
    var selection = getState().studies.selected.items;
    const index = selection.indexOf(key);
    if (index >= 0) {
      dispatch(studyDeselect(key));
      dispatch(actions.change('studies', [...selection]));
    } else {
      dispatch(studySelect(key));
      dispatch(actions.change('studies', [...selection]));
    }
  };
}

export function toggleAllStudies(key, shift, row) {
  return (dispatch, getState) => {
    var allSelected = getState().studies.selected.selectAll;
    if (allSelected) {
      dispatch(studiesDeselectAll([]));
      dispatch(actions.change('studies', []));
      return [];
    } else {
      const studies = Object.keys(getState().studies.items);
      dispatch(studiesSelectAll(studies));
      dispatch(actions.change('studies', studies));
      return studies;
    }
  };
}
