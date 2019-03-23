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
import ServiceList from '../components/ServiceList';
import Events from '../components/Events';
import {Button, Card} from 'kf-uikit';
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
        <Card title="Latest Publication" style={{maxWidth: '100%'}}>
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
        </Card>
        {latestData.length > 0 && (
          <Card title="Latest Releases">
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
          </Card>
        )}
        <Card title="Publish History">
          <PublishHistory />
        </Card>

        <section className="flex justify-around" style={{minHeight: '200px'}}>
          <Card
            title="Register a Task Service"
            className="max-w-sm relative min-h-full"
          >
            <p>
              Task Services follow a common HTTP API spec to process work for a
              release. Register an API endpoint for a task service below.
            </p>
            <center className="absolute w-full p-4" style={{bottom: 0}}>
              <Link to="/service/new">
                <Button color="primary">Register</Button>
              </Link>
            </center>
          </Card>
          <Card
            title="Plan a Release"
            className="max-w-sm relative  min-h-full"
          >
            <p>
              Select studies to be released and submit for review and
              processing.
            </p>
            <center className="absolute w-full p-4" style={{bottom: 0}}>
              <Link to="/planner">
                <Button color="primary">Plan</Button>
              </Link>
            </center>
          </Card>
          <Card
            title="View Past Releases"
            className="max-w-sm relative min-h-full"
          >
            <p>View a history and status of past releases.</p>
            <center className="absolute w-full p-4" style={{bottom: 0}}>
              <Link to="/releases">
                <Button color="primary">View</Button>
              </Link>
            </center>
          </Card>
        </section>
        <Card title="Task Service Status">
          <ServiceList />
        </Card>
        <Card title="Recent Release Events">
          <Events events={this.state.events} />
        </Card>
      </div>
    );
  }
}

export default Status;
