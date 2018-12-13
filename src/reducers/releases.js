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

const releasesPageSuccess = (state = {releases: {}}, action) => {
  switch (action.type) {
    case 'RELEASES_PAGE_SUCCESS':
      const newReleases = action.data.results.reduce((map, obj) => {
        map[obj.kf_id] = obj;
        return map;
      }, {});

      return {
        ...state,
        releases: {...state.releases, ...newReleases},
        next: action.data.next,
        previous: action.data.next,
        count: action.data.count,
        currentPage: Object.keys(newReleases),
      };
    default:
      return state;
  }
};

export default combineReducers({
  error: releasesPageError,
  items: releasesPageSuccess,
  loading: releasesPageLoading,
});
