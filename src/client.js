import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {ApolloLink, concat} from 'apollo-link';
import {coordinatorApi} from './globalConfig';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: coordinatorApi + '/graphql',
  credentials: 'include',
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken') || null,
    },
  });

  return forward(operation);
});

const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, link),
});

export default client;
