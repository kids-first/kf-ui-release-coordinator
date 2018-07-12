import React, { Component } from 'react';
import axios from 'axios';
import { Card, Divider, Button, Row, Col, Spin, Icon, Tag, Tooltip
} from 'antd';
import Progress from '../components/Progress';
import TaskList from '../components/TaskList';
import Events from '../components/Events';
import { coordinatorApi } from '../globalConfig';
import { UserContext } from '../contexts';
const ButtonGroup = Button.Group;


class Release extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      release: {},
      events: [],
      publishing: false,
      canceling: false
    };
    this.getData();
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true;
    this.getData();
    this.timer = setTimeout(() => this.getData(), 3000);
  }

  componentWillUnmount() {
    this.mounted = false
    clearTimeout(this.timer);
  }

  publish() {
    const token = this.props.egoToken;
    const header = {headers: {Authorization: 'Bearer '+token}};
    let release = this.state.release;
    release.state = 'publishing';
    this.setState({publishing: true});
    axios.post(`${coordinatorApi}/releases/${this.props.match.params.releaseId}/publish`, {}, header)
      .then(resp => {
        this.setState({publishing: false});
        this.timer = setTimeout(() => this.getData(), 3000);
      });
  }

  cancel() {
    const token = this.props.egoToken;
    const header = {headers: {Authorization: 'Bearer '+token}};
    let release = this.state.release;
    release.state = 'canceling';
    this.setState({canceling: true});
    axios.delete(`${coordinatorApi}/releases/${this.props.match.params.releaseId}`, header)
      .then(resp => {
        this.setState({canceling: false});
        this.getData();
      });
  }

  getData() {
    if (!this.mounted ||
        this.state.release.state === 'staged' ||
        this.state.release.state === 'canceled' ||
        this.state.release.state === 'published') {
      return
    }
    axios.all([axios.get(`${coordinatorApi}/releases/${this.props.match.params.releaseId}`),
               axios.get(`${coordinatorApi}/events?release=${this.props.match.params.releaseId}`)])
         .then(axios.spread((release, events) => {
            this.setState({
              release: release.data,
              events: events.data.results.reverse(),
              loading: false
            });
            this.timer = setTimeout(() => this.getData(), 3000);
         }))
         .catch(error => console.log(error));
  }


  whatColor(ev) {
    var color = 'green';
    switch(ev.event_type) {
      case 'info':
        color = '#19a9c4';
        break;
      case 'warning':
        color = 'red';
        break;
      case 'error':
        color = 'red';
        break;
      default:
        color = 'blue';
    }
    return color
  }

  whatIcon(ev) {
    var icon = 'info';

    if (ev.message.includes('release started')) {
      icon = 'calendar';
    } else if (ev.message.includes('initializing new')) {
      icon = 'ellipsis';
    } else if (ev.message.includes('was accepted')) {
      icon = 'check';
    } else if (ev.message.includes('starting work')) {
      icon = 'calendar';
    } else if (ev.message.includes('has started')) {
      icon = 'caret-right';
    } else if (ev.message.includes('has begun publishing')) {
      icon = 'caret-right';
    } else if (ev.message.includes('publishing release')) {
      icon = 'calendar';
    }

    return icon
  }

  render() {
    let disabled = (this.state.publishing || this.state.release.state !== 'staged') ? 'disabled' : '';

    let style = {
      marginTop: '24px',
      marginBottom: '24px',
    };

    if (this.state.release.state === 'published') {
      style.backgroundColor = '#efffe8';
      style.padding = 20;
      style.marginTop = '4px';
      style.marginBottom = '4px';
    }

    if (this.state.release.state === 'canceled'
        || this.state.release.state === 'failed') {
      style.backgroundColor = '#f8a4a833';
      style.padding = 20;
      style.marginTop = '4px';
      style.marginBottom = '4px';
    }

    if (this.state.loading) {
      return (<Spin tip='loading...'><Card style={{height: 300}}></Card></Spin>)
    }

    return (
      <Card title={`Release ${this.props.match.params.releaseId} - ${this.state.release.name}`}>
        <Row>
          <Col>
            <h3 style={{display: "inline"}}><Icon type='tag' />{this.state.release.name} </h3>
              <Tag>{this.state.release.kf_id}</Tag>
            <h5><Icon type="calendar" /> Created At: <em>{Date(this.state.release.created_at)}</em></h5>
            <h5><Icon type="user" /> Author: <em>{this.state.release.author}</em></h5>
          </Col>

          <span>Studies in this Release:</span>
          <br />
          {this.state.release.studies.map((r, i) => (
            <Tag key={i}>{r}</Tag>
          ))}
          <br />

          <span>Release Notes:</span>
          <p>
            {this.state.release.description}
          </p>
        </Row>
        <Divider style={{margin: 0, marginTop: '24px'}}/>
        <Row justify='center' type='flex' style={style}>
          {this.state.release.state !== 'canceled' && this.state.release.state !== 'failed' ? (
            <Col span={22} >
              <Progress release={this.state.release}/>
            </Col>
          ) : (
            <h2><Icon type="warning"/> {this.state.release.state}</h2>
          )}
        </Row>

        <Divider style={{margin: 0, marginBottom: '24px'}}/>

        <Row gutter={16} type='flex' justify='space-around'>
          <ButtonGroup>
            <Button
              size='large'
              type='primary'
              onClick={() => this.publish()}
              disabled={disabled}>
              <Icon type='check-circle'/>Publish
            </Button>
            <Button
              size='large'
              type='primary'
              disabled={this.state.release.state !== 'staged'}>
              <Icon type='search'/>Preview in Portal
            </Button>
            <Button
              size='large'
              type='danger'
              onClick={() => this.cancel()}
              loading={this.state.canceling}
              disabled={this.state.release.state === 'published'
                        || this.state.release.state === 'publishing'
                        || this.state.release.state === 'canceled'
                        || this.state.release.state === 'failed'}>
              <Icon type='close-circle'/>Cancel
            </Button>
          </ButtonGroup>
        </Row>

        <Divider />

        <Row justify='space-around' type='flex'>
          <Col span={10}>
            <h2>Task Status <span /> 
            <Tooltip title="Current states of tasks involved in this release">
              <Icon type='info-circle-o' />
            </Tooltip>
            </h2>
            <TaskList releaseId={this.state.release.kf_id} />
          </Col>

          <Col span={10}>
        <h2>Event History <span />
        <Tooltip title="Events reported relating to this release tagged with relevant task service and task ids">
          <Icon type='info-circle-o' />
        </Tooltip>
        </h2>
            <Events events={this.state.events} />
          </Col>
        </Row>
      </Card>
    );
  }
}

function ReleaseProps(props) {
  return (
    <UserContext.Consumer>
      {user => <Release{...props}
        user={user.user} egoToken={user.egoToken}/>}
    </UserContext.Consumer>
  )
};

export default ReleaseProps;
