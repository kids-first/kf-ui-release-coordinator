import jwtDecode from 'jwt-decode';

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

export function authSuccess(token, tokenExpires, user) {
  return {
    type: 'AUTH_SUCCESS',
    token,
    tokenExpires,
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

export function auth0Login(access_token, id_token) {
  return dispatch => {
    dispatch(beginAuth(true));
    const jwtData = jwtDecode(id_token);
    const user = {
      name: jwtData.name,
      email: jwtData.email,
      status: 'Approved',
      firstName: jwtData.given_name,
      lastName: jwtData.family_name,
      groups: jwtData['https://kidsfirstdrc.org/groups'],
      roles: jwtData['https://kidsfirstdrc.org/roles'],
      permissions: jwtData['https://kidsfirstdrc.org/permissions'],
    };
    dispatch(authSuccess(access_token, jwtData.exp, user));
  };
}

export function auth0Logout() {
  return dispatch => {
    dispatch(authSuccess(null, 0, {}));
  };
}
