import {gql} from 'apollo-boost';

export const GET_RELEASE = gql`
  query GetRelease($id: ID!) {
    release(id: $id) {
      id
      author
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
            createdAt
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
`;

export const ALL_RELEASES = gql`
  query AllReleases($first: Int, $state: String) {
    allReleases(
      first: $first
      state: $state
      orderBy: "-created_at"
    ) {
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

export const ALL_STUDIES = gql`
  query AllStudies($first: Int) {
    allStudies(first: $first, orderBy: "-created_at") {
      edges {
        node {
          id
          kfId
          name
          createdAt
          visible
          deleted
          releases(state: "published", first: 1, orderBy: "-created_at") {
            edges {
              node {
                id
                kfId
                version
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_STUDY = gql`
  query GetStudy($id: ID!) {
    study(id: $id) {
      id
      kfId
      name
      createdAt
      visible
      deleted
      releases(orderBy: "-created_at") {
        edges {
          node {
            id
            kfId
            name
            description
            createdAt
            version
          }
        }
      }
    }
  }
`;

export const ALL_NOTES = gql`
  query AllNotes($release: ID) {
    allReleaseNotes(release: $release) {
      edges {
        node {
          id
          kfId
          description
          createdAt
        }
      }
    }
  }
`;

export const ALL_EVENTS = gql`
  query AllEvents($release: ID) {
    allEvents(release: $release, orderBy: "-created_at") {
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

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    taskService(id: $id) {
      id
      author
      kfId
      name
      createdAt
      description
      healthStatus
      enabled
      url
    }
  }
`;

export const ALL_TASKS = gql`
  query AllTasks($first: Int) {
    allTasks(first: $first) {
      edges {
        node {
          id
          kfId
          state
          createdAt
          taskService {
            id
            name
          }
        }
      }
    }
  }
`;

export const MY_PROFILE = gql`
  query profile {
    myProfile {
      id
      username
      email
      roles
      groups
      picture
      slackNotify
      slackMemberId
      firstName
      lastName
    }
  }
`;
