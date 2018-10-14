import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Avatar, Button, Col, Card, Row, Icon, Tooltip } from 'antd';
import TimeAgo from 'react-timeago'
import { VictoryChart, VictoryScatter, VictoryAxis, VictoryLegend } from 'victory';
import ServiceList from '../components/ServiceList';
import Events from '../components/Events';
import { coordinatorApi } from '../globalConfig';
import PublishHistory from '../components/PublishHistory';

const { Meta } = Card;

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
    this.mounted = false
    clearTimeout(this.timer);
  }

  getLatest() {
    axios.get(`${coordinatorApi}/releases?state=published&limit=1`)
         .then((releases) => {
            this.setState({
              latestPublish: releases.data.results.length > 0 ? releases.data.results[0] : {},
            });
         })
         .catch(error => console.log(error));

    axios.get(`${coordinatorApi}/releases?limit=8`)
         .then((releases) => {
            this.setState({
              latest: releases.data.results,
            });
         })
         .catch(error => console.log(error));
  }

  getData() {
    if (!this.mounted) {
      return
    }
    axios.get(`${coordinatorApi}/events?limit=5`)
         .then((events) => {
            this.setState({
              events: events.data.results,
            });
            this.timer = setTimeout(() => this.getData(), 10000);
         })
         .catch(error => console.log(error));
  }

  render() {
    const cardStyle = {
      textAlign: 'center',
    };
    const latestPublish =  this.state.latestPublish;
    const latestData = this.state.latest ? this.state.latest.map((r) => (
      {x: r.kf_id, y: 0, size:5, label: r.version, state: r.state}
    )) : null;

    const stateColors = {
      'initialized': '#fce220',
      'running': '#fa8c16',
      'staged': '#66fc25',
      'publishing': '#91d5ff',
      'published': '#1890ff',
      'canceled': '#dbdbdb',
      'failed': '#fc4a3a',
    };
    return (
      <div>
        <Row gutter={8} type='flex' style={{margin: '8px 0'}}>
          <Col span={24}>
            <Card style={cardStyle}>
              <h3>Latest Publication</h3>
              {latestPublish ? (
                <div>
                  <h1>{latestPublish.version}</h1>
                  <h4><TimeAgo date={latestPublish.created_at}/></h4>
                  <Link to={`/releases/${latestPublish.kf_id}`}>
                    <Button size='small' icon='profile' type='primary'>
                      {latestPublish.kf_id}
                    </Button>
                  </Link>
                </div>
              ) : (
                <h2>No Releases Published Yet</h2>
              )}
            </Card>
          </Col>
        </Row>
				{latestData.length > 0 && (
        <Row gutter={8} type='flex' style={{margin: '8px 0'}}>
          <Col span={24}>
            <Card title='Latest Releases'>
              <VictoryChart
								height={70}
								padding={{top: 20, bottom: 20, left: 50, right: 50}}
              >
                <VictoryAxis independentAxis style={{tickLabels: {fontSize: 6, padding: 10}}}/>
                <VictoryScatter
                    data={latestData.reverse()}
                    style={{
                      data: {
                        fill: (d) => stateColors[d.state],
                        strokeWidth: 3
                      },
											labels: {
												padding: 10,
                        fontSize: 14
											}
                    }}
                  />

               <VictoryLegend
                  orientation="horizontal"
                  centerTitle
                  x={0}
                  y={0}
                  gutter={0}
                  style={{
                    border: { stroke: "none" },
                    title: { fontSize: 8 },
                    labels: { fontSize: 6 },
                  }}
                  borderPadding={0}
                  padding={{ top: 0, bottom: 0 }}
                  data={Object.keys(stateColors).map((v) => (
                        {name: v, symbol: { fill: stateColors[v] }}
                  ))}
                />
              </VictoryChart>
            </Card>
          </Col>
        </Row>
				)}
        <Row gutter={8} type='flex' style={{margin: '8px 0'}}>
          <Col span={24}>
            <Card title='Publish History'>
              <PublishHistory />
            </Card>
          </Col>
        </Row>
        <Row gutter={8} type='flex' style={{margin: '8px 0'}}>
          <Col span={8}>
            <Card style={{height: '230px'}}
              actions={[<Link to="/service/new"><Button size='large' type='primary'>Register</Button></Link>]}>
              <Meta
                  avatar={<Avatar icon="tool" />}
                  title="Register a Task Service"
                  description="Task Services follow a common HTTP API spec to process work for a release. Register an API endpoint for a task service below."
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{height: '230px'}}
              actions={[<Link to="/planner"><Button style={{width: '100%'}} size='large' type='primary'>Plan</Button></Link>]}>
              <Meta
                  avatar={<Avatar icon="calendar" />}
                  title="Plan a Release"
                  description="Select studies to be released and submit for review and processing."
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{height: '230px'}}
              actions={[<Link to="/releases"><Button size='large' type='primary'>View</Button></Link>]}>
              <Meta
                  avatar={<Avatar icon="tag" />}
                  title="View Past Releases"
                  description="View a history and status of past releases."
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={8} type='flex' style={{margin: '8px 0'}}>
          <Col span={12}>
            <Card>
              <h2>Task Service Status <span />
              <Tooltip title="Current state of Task Services">
                <Icon type='info-circle-o' />
              </Tooltip>
              </h2>
              <ServiceList />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <h2>Recent Release Events <span />
              <Tooltip title="Latest events reported to the Coordinator">
                <Icon type='info-circle-o' />
              </Tooltip>
              </h2>
              <Events events={this.state.events} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Status;
