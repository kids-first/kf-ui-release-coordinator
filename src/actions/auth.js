import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {egoApi} from '../globalConfig';

export function beginAuth(loading) {
  return {
    type: 'AUTH_BEGIN',
  };
}

export function userLoggedIn(user) {
  return {
    type: 'AUTH_SUCCESS',
    user: user,
  };
}

export function authSuccess(token, user) {
  return {
    type: 'AUTH_SUCCESS',
    token,
    user,
  };
}

export function authNotAllowed(message) {
  return {
    type: 'AUTH_DENIED',
    message,
  };
}

export function authError(message) {
  return {
    type: 'AUTH_ERROR',
    message,
  };
}

/*
 * Exchange the id token from google for an ego token
 */
export function loginUser(id_token) {
  return dispatch => {
    dispatch(beginAuth(true));

    axios
      .get(egoApi + '/oauth/google/token', {headers: {token: id_token}})
      .then(resp => {
        const jwtData = jwtDecode(resp.data);
        const user = {
          ...jwtData.context,
        };
        dispatch(authSuccess(resp.data, user.user))
      })
      .catch(err => {
        if (err.code === 403) {
          dispatch(authNotAllowed(err));
        }
        dispatch(authError(err));
      });
  };
}
