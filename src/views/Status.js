import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {Button, Card, Header, Icon, Segment} from 'semantic-ui-react';
import ServiceList from '../components/ServiceList';
import Events from '../components/Events';
import LatestPublish from '../components/LatestPublish';
import LatestReleases from '../components/LatestReleases';

import {ALL_EVENTS, ALL_RELEASES, ALL_SERVICES} from '../queries';

const Status = () => {
  const {loading: eventsLoading, error: eventsError, data: events} = useQuery(
    ALL_EVENTS,
  );

  const {
    loading: latestPublishLoading,
    error: latestPublishError,
    data: latestPublish,
  } = useQuery(ALL_RELEASES, {variables: {state: 'published', first: 1}});

  const {
    loading: latestReleasesLoading,
    error: latestReleasesError,
    data: latestReleases,
  } = useQuery(ALL_RELEASES, {variables: {first: 5}});

  const {
    loading: servicesLoading,
    error: servicesError,
    data: services,
  } = useQuery(ALL_SERVICES);

  return (
    <Segment basic>
      <Card fluid>
        <Card.Content>
          <Card.Header>Latest Publication</Card.Header>
          <LatestPublish
            release={
              latestPublish &&
              latestPublish.allReleases.edges.length > 0 &&
              latestPublish.allReleases.edges[0].node
            }
            loading={latestPublishLoading}
            error={latestPublishError}
          />
        </Card.Content>
      </Card>
      <Card fluid>
        <Card.Content>
          <Card.Header>Latest Releases</Card.Header>
          <LatestReleases
            releases={latestReleases && latestReleases.allReleases.edges}
            loading={latestReleasesLoading}
            error={latestReleasesError}
          />
        </Card.Content>
      </Card>

      <Card.Group itemsPerRow={3}>
        <Card>
          <Card.Content>
            <Header icon>
              <Icon name="settings" />
              Register a Task Service
              <Header.Subheader>
                Register an API endpoint for a new task service.
              </Header.Subheader>
            </Header>
          </Card.Content>
          <Card.Content extra textAlign="center">
            <Link to="/service/new">
              <Button primary>Register</Button>
            </Link>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <Header icon>
              <Icon name="calendar outline" />
              Plan a Release
              <Header.Subheader>
                Select studies to be released and submit for review and
                processing.
              </Header.Subheader>
            </Header>
          </Card.Content>
          <Card.Content extra textAlign="center">
            <Link to="/planner">
              <Button primary>Plan</Button>
            </Link>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <Header icon>
              <Icon name="tag" />
              View Past Releases
              <Header.Subheader>
                View a history and status of past releases.
              </Header.Subheader>
            </Header>
          </Card.Content>
          <Card.Content extra textAlign="center">
            <Link to="/releases">
              <Button primary>View</Button>
            </Link>
          </Card.Content>
        </Card>
      </Card.Group>

      <Card fluid>
        <Card.Content>
          <Card.Header>Task Service Status</Card.Header>
          <ServiceList
            services={services && services.allTaskServices.edges}
            loading={servicesLoading}
            error={servicesError}
          />
        </Card.Content>
      </Card>
      <Card fluid>
        <Card.Content>
          <Card.Header>Recent Release Events</Card.Header>
          <Events
            events={events && events.allEvents.edges}
            loading={eventsLoading}
            error={eventsError}
          />
        </Card.Content>
      </Card>
    </Segment>
  );
};

export default Status;
