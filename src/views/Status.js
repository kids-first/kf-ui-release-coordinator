import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Alert, Avatar, Button, Col, Card, Tag, Row, Icon, Tooltip } from 'antd';
import TimeAgo from 'react-timeago'
import ServiceList from '../components/ServiceList';
import Events from '../components/Events';
import { coordinatorApi } from '../globalConfig';

const { Meta } = Card;

class Status extends Component {

  constructor(props) {
    super(props);

    this.state = {
      events: [],
      latest: {},
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
              latest: releases.data.results[0],
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
    return (
      <div>
        <Row gutter={8} style={{margin: '8px 0'}}>
        <Col span={12}>
          <Card style={cardStyle}>
            <h3>Latest Publication</h3>
            {this.state.latest ? (
              <div>
                <h1>{this.state.latest.version}</h1>
                <h4><TimeAgo date={this.state.latest.created_at}/></h4>
                <Link to={`/releases/${this.state.latest.kf_id}`}>
                  <Button size='small' icon='profile' type='primary'>
                    {this.state.latest.kf_id}
                  </Button>
                </Link>
              </div>
            ) : (
              <h2>No Releases Published Yet</h2>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card style={cardStyle}>
            <h4>Release At</h4>
            <h2>4 Oct</h2>
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
