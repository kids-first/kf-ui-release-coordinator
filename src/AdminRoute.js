import React from 'react';
import jwtDecode from 'jwt-decode';
import {Route, Redirect, withRouter} from 'react-router-dom';

export const isAdmin = () => {
  const token = localStorage.getItem('accessToken');
  if (token == null) {
    return false;
  }

  const decoded = jwtDecode(token);
  if (decoded.exp < Math.floor(new Date().getTime() / 1000)) return false;

  // Extract roles based on whether the token is from ego or auth0
  const roles = decoded['https://kidsfirstdrc.org/roles'];

  return roles.includes('ADMIN');
};

/**
 * A route that only allows access to admin users, otherwise routes to the
 * index page
 */
const AdminRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      isAdmin() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{pathname: '/login', state: {from: rest.location.pathname}}}
        />
      )
    }
  />
);

export default withRouter(AdminRoute);
