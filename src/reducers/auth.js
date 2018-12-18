import {combineReducers} from 'redux';

const initialState = {
  loading: true,
  token: null,
  error: {hasError: false, message: ''},
  user: {},
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_BEGIN':
      return {
        ...state,
        loading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        token: action.token,
        user: action.user,
        loading: false,
      };
    case 'AUTH_DENIED':
    case 'AUTH_ERROR':
      return {
        ...state,
        error: {hasError: true, message: action.message},
      };
    default:
      return state;
  }
};

export default auth;
