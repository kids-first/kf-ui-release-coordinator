import React from 'react';

export const UserContext = React.createContext({
  loggedIn: false,
  googleToken: null,
  egoToken: null,
  onLogin: () => {}
});
