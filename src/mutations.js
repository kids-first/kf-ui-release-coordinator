import {gql} from 'apollo-boost';

export const START_RELEASE = gql`
  mutation StartRelease($input: ReleaseInput!) {
    startRelease(input: $input) {
      release {
        id
        kfId
        version
        name
        state
        createdAt
        isMajor
        description
        studies {
          edges {
            node {
              id
              kfId
              name
            }
          }
        }
        notes {
          edges {
            node {
              id
              description
            }
          }
        }
      }
    }
  }
`;

export const PUBLISH_RELEASE = gql`
  mutation PublishRelease($release: ID!) {
    publishRelease(release: $release) {
      release {
        id
        kfId
        version
        name
        state
        createdAt
        isMajor
        description
        studies {
          edges {
            node {
              id
              kfId
              name
            }
          }
        }
        notes {
          edges {
            node {
              id
              description
            }
          }
        }
      }
    }
  }
`;

export const CANCEL_RELEASE = gql`
  mutation CancelRelease($release: ID!) {
    cancelRelease(release: $release) {
      release {
        id
        kfId
        version
        name
        state
        createdAt
        isMajor
        description
        studies {
          edges {
            node {
              id
              kfId
              name
            }
          }
        }
        notes {
          edges {
            node {
              id
              description
            }
          }
        }
      }
    }
  }
`;
