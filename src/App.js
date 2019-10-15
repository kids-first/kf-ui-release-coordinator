import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import Root from './containers/Root';
import client from './client';

const App = () => (
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>
);

export default App;
