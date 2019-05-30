import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryLegend,
} from 'victory';
import {Button, Card} from 'semantic-ui-react';
import ServiceList from '../components/ServiceList';
import Events from '../components/Events';
import {coordinatorApi} from '../globalConfig';
import PublishHistory from '../components/PublishHistory';

class Status extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      latestPublish: {},
      latest: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.getLatest();
    this.timer = setTimeout(() => this.getData(), 1000);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
  }

  getLatest() {
    axios
      .get(`${coordinatorApi}/releases?state=published&limit=1`)
      .then(releases => {
        this.setState({
          latestPublish:
            releases.data.results.length > 0 ? releases.data.results[0] : {},
        });
      })
      .catch(error => console.log(error));

    axios
      .get(`${coordinatorApi}/releases?limit=8`)
      .then(releases => {
        this.setState({
          latest: releases.data.results,
        });
      })
      .catch(error => console.log(error));
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
    const latestPublish = this.state.latestPublish;
    const latestData = this.state.latest
      ? this.state.latest.map(r => ({
          x: r.kf_id,
          y: 0,
          size: 5,
          label: r.version,
          state: r.state,
        }))
      : null;

    const stateColors = {
      initialized: '#fce220',
      running: '#fa8c16',
      staged: '#66fc25',
      publishing: '#91d5ff',
      published: '#1890ff',
      canceled: '#dbdbdb',
      failed: '#fc4a3a',
    };
    return (
      <div>
        <Card fluid>
          <Card.Content>
            <Card.Header>Latest Publication</Card.Header>
            {latestPublish ? (
              <center>
                <h2 style={{margin: 0}}>{latestPublish.name}</h2>
                <h1 style={{margin: 0}}>{latestPublish.version}</h1>
                <h4 style={{margin: 0}}>
                  <TimeAgo date={latestPublish.created_at} />
                </h4>
                <Link to={`/releases/${latestPublish.kf_id}`}>
                  <Button size="small" icon="profile" type="primary">
                    {latestPublish.kf_id}
                  </Button>
                </Link>
              </center>
            ) : (
              <h2>No Releases Published Yet</h2>
            )}
          </Card.Content>
        </Card>
        {latestData.length > 0 && (
          <Card fluid>
            <Card.Content>
              <Card.Header>LatestReleases</Card.Header>
              <VictoryChart
                height={70}
                padding={{top: 20, bottom: 20, left: 50, right: 50}}
              >
                <VictoryAxis
                  independentAxis
                  style={{tickLabels: {fontSize: 6, padding: 10}}}
                />
                <VictoryScatter
                  data={latestData.reverse()}
                  style={{
                    data: {
                      fill: d => stateColors[d.state],
                      strokeWidth: 3,
                    },
                    labels: {
                      padding: 10,
                      fontSize: 14,
                    },
                  }}
                />

                <VictoryLegend
                  orientation="horizontal"
                  centerTitle
                  x={0}
                  y={0}
                  gutter={0}
                  style={{
                    border: {stroke: 'none'},
                    title: {fontSize: 8},
                    labels: {fontSize: 6},
                  }}
                  borderPadding={0}
                  padding={{top: 0, bottom: 0}}
                  data={Object.keys(stateColors).map(v => ({
                    name: v,
                    symbol: {fill: stateColors[v]},
                  }))}
                />
              </VictoryChart>
            </Card.Content>
          </Card>
        )}
        <Card fluid>
          <Card.Content>
            <Card.Header>Publish History</Card.Header>
            <PublishHistory />
          </Card.Content>
        </Card>

        <Card.Group itemsPerRow={3}>
          <Card>
            <Card.Content>
              <Card.Header>Register a Task Service</Card.Header>
              <Card.Description>
                Task Services follow a common HTTP API spec to process work for
                a release. Register an API endpoint for a task service below.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Link to="/service/new">
                <Button color="primary">Register</Button>
              </Link>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Card.Header>Plan a Release</Card.Header>
              <Card.Description>
                Select studies to be released and submit for review and
                processing.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Link to="/planner">
                <Button color="primary">Plan</Button>
              </Link>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Card.Header>View Past Releases</Card.Header>
              <Card.Description>
                View a history and status of past releases.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Link to="/releases">
                <Button color="primary">View</Button>
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
      </div>
    );
  }
}

export default Status;
