import {gql} from 'apollo-boost';

export const ALL_RELEASES = gql`
  query AllReleases($first: Int, $state: String) {
    allReleases(first: $first, state: $state, orderBy: "-created_at") {
      edges {
        node {
          id
          kfId
          version
          name
          state
          createdAt
          isMajor
          description
        }
      }
    }
  }
`;

export const ALL_EVENTS = gql`
  query AllEvents {
    allEvents(orderBy: "-created_at") {
      edges {
        node {
          id
          createdAt
          message
          release {
            id
            kfId
          }
          taskService {
            id
            kfId
          }
          task {
            id
            kfId
          }
        }
      }
    }
  }
`;

export const ALL_SERVICES = gql`
  query AllServices {
    allTaskServices {
      edges {
        node {
          id
          kfId
          name
          description
          enabled
          url
          author
        }
      }
    }
  }
`;
