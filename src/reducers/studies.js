import {combineReducers} from 'redux';

const studiesSyncing = (state = false, action) => {
  switch (action.type) {
    case 'STUDIES_SYNCING':
      return action.loading;
    default:
      return state;
  }
};

const studiesSyncError = (
  state = {hasError: false, message: '', code: 200},
  action
) => {
  switch (action.type) {
    case 'STUDIES_SYNC_ERROR':
      return {
        hasError: action.hasError,
        message: action.error.message,
        code: action.error.code
      };
    default:
      return state;
  }
};

const studiesSyncSuccess = (state = '', action) => {
  switch (action.type) {
    case 'STUDIES_SYNC_SUCCESS':
      return action.data.message;
    case 'STUDIES_SYNC_ERROR':
      return action.data.message;
    case 'STUDIES_SYNCING':
      return 'Syncing studies...';
    default:
      return state;
  }
};

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
  action
) => {
  switch (action.type) {
    case 'STUDIES_PAGE_ERROR':
      return {
        hasError: action.hasError,
        message: action.message,
        code: action.code
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
          ids: releaseIds
        }
      };
    case 'STUDIES_PAGE_ERROR':
      return {
        ...state,
        [action.page]: {
          error: {
            message: action.message,
            code: action.code
          }
        }
      };
    default:
      return state;
  }
};

const studiesSelected = (state = {items: [], selectAll: false}, action) => {
  switch (action.type) {
    case 'STUDY_SELECTED':
      state.items.push(action.studyId);
      return {
        ...state,
        items: state.items
      };
    case 'STUDY_DESELECTED':
      const index = state.items.indexOf(action.studyId);
      if (index !== -1) state.items.splice(index, 1);

      return {
        ...state,
        selectAll: false
      };
    case 'STUDIES_DESELECTED':
      return {
        selectAll: false,
        items: []
      };
    case 'STUDIES_SELECTED':
      return {
        ...state,
        selectAll: true,
        items: [...action.selected]
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
  syncing: studiesSyncing,
  syncError: studiesSyncError,
  syncMessage: studiesSyncSuccess,
  selected: studiesSelected
});
