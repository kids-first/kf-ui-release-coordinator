import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {Button, Card, Segment, Image} from 'semantic-ui-react';
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
          <Image src="https://images.unsplash.com/photo-1520500807606-4ac9ae633574?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60" />
          <Card.Content>
            <Card.Header>Register a Task Service</Card.Header>
            <Card.Description>
              Task Services follow a common HTTP API spec to process work for a
              release. Register an API endpoint for a task service below.
            </Card.Description>
          </Card.Content>
          <Card.Content extra textAlign="center">
            <Link to="/service/new">
              <Button primary>Register</Button>
            </Link>
          </Card.Content>
        </Card>

        <Card>
          <Image src="https://images.unsplash.com/photo-1490724500206-cd5482e02b9e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60" />
          <Card.Content>
            <Card.Header>Plan a Release</Card.Header>
            <Card.Description>
              Select studies to be released and submit for review and
              processing.
            </Card.Description>
          </Card.Content>
          <Card.Content extra textAlign="center">
            <Link to="/planner">
              <Button primary>Plan</Button>
            </Link>
          </Card.Content>
        </Card>

        <Card>
          <Image src="https://images.unsplash.com/photo-1506784881475-0e408bbca849?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60" />
          <Card.Content>
            <Card.Header>View Past Releases</Card.Header>
            <Card.Description>
              View a history and status of past releases.
            </Card.Description>
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
