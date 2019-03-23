import {combineReducers} from 'redux';

const releasesPageLoading = (state = true, action) => {
  switch (action.type) {
    case 'RELEASES_PAGE_LOADING':
      return action.loading;
    default:
      return state;
  }
};

const releasesPageError = (
  state = {hasError: false, message: '', code: ''},
  action,
) => {
  switch (action.type) {
    case 'RELEASES_PAGE_ERROR':
      return {
        hasError: action.hasError,
        message: action.message,
        code: action.code,
      };
    default:
      return state;
  }
};

const releasesPageItems = (state = {}, action) => {
  switch (action.type) {
    case 'RELEASES_PAGE_SUCCESS':
      const newReleases = action.data.results.reduce((map, obj) => {
        map[obj.kf_id] = obj;
        return map;
      }, {});

      return {...newReleases, ...state};
    default:
      return state;
  }
};

const releasesPagePagination = (state = {currentPage: null}, action) => {
  switch (action.type) {
    case 'RELEASES_PAGE_SUCCESS':
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
    case 'RELEASES_PAGE_ERROR':
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
  items: releasesPageItems,
  pages: releasesPagePagination,
  error: releasesPageError,
  loading: releasesPageLoading,
});
