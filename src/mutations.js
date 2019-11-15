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

export const CREATE_SERVICE = gql`
  mutation CreateService($input: TaskServiceInput!) {
    createTaskService(input: $input) {
      taskService {
        id
        kfId
        name
        createdAt
        description
        healthStatus
        enabled
        url
      }
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($taskService: ID!, $input: TaskServiceInput!) {
    updateTaskService(taskService: $taskService, input: $input) {
      taskService {
        id
        kfId
        name
        createdAt
        description
        healthStatus
        enabled
        url
      }
    }
  }
`;

export const SYNC_STUDIES = gql`
  mutation SyncStudies {
    syncStudies {
      new {
        edges {
          node {
            id
            kfId
            name
            createdAt
            visible
            deleted
          }
        }
      }
      deleted {
        edges {
          node {
            id
            kfId
            name
            createdAt
            visible
            deleted
          }
        }
      }
    }
  }
`;

export const UPDATE_RELEASE = gql`
  mutation UpdateRelease($input: UpdateReleaseInput!, $release: ID!) {
    updateRelease(release: $release, input: $input) {
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
