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
