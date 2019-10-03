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
