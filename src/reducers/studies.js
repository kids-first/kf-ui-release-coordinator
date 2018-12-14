import {combineReducers} from 'redux';

const studiesPageLoading = (state = true, action) => {
  switch (action.type) {
    case 'STUDIES_PAGE_LOADING':
      return action.loading;
    default:
      return state;
  }
};

const studiesPageError = (
  state = {hasError: false, message: '', code: ''},
  action,
) => {
  switch (action.type) {
    case 'STUDIES_PAGE_ERROR':
      return {
        hasError: action.hasError,
        message: action.message,
        code: action.code,
      };
    default:
      return state;
  }
};

const studiesPageItems = (state = {}, action) => {
  switch (action.type) {
    case 'STUDIES_PAGE_SUCCESS':
      const newReleases = action.data.results.reduce((map, obj) => {
        map[obj.kf_id] = obj;
        return map;
      }, {});

      return {...newReleases, ...state};
    default:
      return state;
  }
};

const studiesPagePagination = (state = {currentPage: null}, action) => {
  switch (action.type) {
    case 'STUDIES_PAGE_SUCCESS':
      const releaseIds = action.data.results.map(res => res.kf_id);
      return {
        ...state,
        currentPage: action.page,
        count: action.data.count,
        [action.page]: {
          next: action.data.next,
          previous: action.data.previous,
          ids: releaseIds,
        },
      };
    case 'STUDIES_PAGE_ERROR':
      return {
        ...state,
        [action.page]: {
          error: {
            message: action.message,
            code: action.code,
          },
        },
      };
    default:
      return state;
  }
};

export default combineReducers({
  items: studiesPageItems,
  pages: studiesPagePagination,
  error: studiesPageError,
  loading: studiesPageLoading,
});
