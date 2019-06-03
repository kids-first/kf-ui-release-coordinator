import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Button, Card, Segment, Image} from 'semantic-ui-react';
import ServiceList from '../components/ServiceList';
import Events from '../components/Events';
import {coordinatorApi} from '../globalConfig';
import LatestPublish from '../components/LatestPublish';
import LatestReleases from '../components/LatestReleases';

class Status extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      latest: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.timer = setTimeout(() => this.getData(), 1000);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
  }

  getData() {
    if (!this.mounted) {
      return;
    }
    axios
      .get(`${coordinatorApi}/events?limit=5`)
      .then(events => {
        this.setState({
          events: events.data.results,
        });
        this.timer = setTimeout(() => this.getData(), 10000);
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Card.Header>Latest Publication</Card.Header>
            <LatestPublish />
          </Card.Content>
        </Card>
        <Card fluid>
          <Card.Content>
            <Card.Header>Latest Releases</Card.Header>
            <LatestReleases releases={this.state.latest.reverse()} />
          </Card.Content>
        </Card>

        <Card.Group itemsPerRow={3}>
          <Card>
            <Image src="https://images.unsplash.com/photo-1520500807606-4ac9ae633574?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60" />
            <Card.Content>
              <Card.Header>Register a Task Service</Card.Header>
              <Card.Description>
                Task Services follow a common HTTP API spec to process work for
                a release. Register an API endpoint for a task service below.
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
            <ServiceList />
          </Card.Content>
        </Card>
        <Card fluid>
          <Card.Content>
            <Card.Header>Recent Release Events</Card.Header>
            <Events events={this.state.events} />
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default Status;
