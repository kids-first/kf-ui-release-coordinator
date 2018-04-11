import React, { Component } from 'react';
import axios from 'axios';
import {
  Avatar, Card, Divider, Button, List, Badge, Row,
  Col, Spin, Timeline, Icon
} from 'antd';
import Progress from '../components/Progress';
const ButtonGroup = Button.Group;


class Release extends Component {
  constructor(props) {
    super(props)

    let tasks = [
      {
        'kf_id': 'TA_DVV673SB',
        'name': 'Release Tagger',
        'state': 'ok',
      }, {
        'kf_id': 'TA_YW6XBRST',
        'name': 'Cavatica Sync',
        'state': 'ok',
      }, {
        'kf_id': 'TA_FTDDYNM8',
        'name': 'Portal ETL',
        'state': 'ok',
      }
    ];

    this.state = {
      loading: true,
      release: {},
      tasks: tasks,
      publishing: false
    };
    this.getData();
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true;
    this.timer = setTimeout(() => this.getData(), 1000);
  }

  componentWillUnmount() {
    this.mounted = false
    clearTimeout(this.timer);
  }

  publish() {
    let api = process.env.REACT_APP_COORDINATOR_API;
    let release = this.state.release;
    release.state = 'publishing';
    this.setState({publishing: true});
    axios.post(`${api}/releases/${this.props.match.params.releaseId}/publish`)
      .then(resp => {
        this.setState({publishing: false});
        this.timer = setTimeout(() => this.getData(), 1000);
      });
  }

  getData() {
    if (!this.mounted ||
        this.state.release.state == 'staged' ||
        this.state.release.state == 'published') {
      return
    }
    let api = process.env.REACT_APP_COORDINATOR_API;
    axios.get(`${api}/releases/${this.props.match.params.releaseId}`)
      .then(resp => {
        let data = resp.data.results;
        this.setState({release: data, loading: false});
        this.timer = setTimeout(() => this.getData(), 1000);
      });
  }

  render() {
    let disabled = (this.state.publishing || this.state.release.state != 'staged') ? 'disabled' : '';

    let style = {
      marginTop: '24px',
      marginBottom: '24px',
    };

    if (this.state.release.state == 'published') {
      style.backgroundColor = '#efffe8';
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
          <h2>{this.state.release.name}</h2>
          <h3>{this.state.release.kf_id}</h3>
          <h3>Created At: {Date(this.state.release.created_at)}</h3>

          <span>Release Notes:</span>
          <p>
            {this.state.release.description}
          </p>
        </Row>
        <Divider style={{margin: 0, marginTop: '24px'}}/>
        <Row justify='center' type='flex' style={style}>
          <Col span={22} >
            <Progress release={this.state.release}/>
          </Col>
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
              disabled={this.state.release.state != 'staged'}>
              <Icon type='search'/>Preview in Portal
            </Button>
            <Button
              size='large'
              type='danger'
              disabled={this.state.release.state == 'published'
                        || this.state.release.state == 'publishing'}>
              <Icon type='close-circle'/>Cancel
            </Button>
          </ButtonGroup>
        </Row>

        <Divider />

        <Row justify='space-around' type='flex'>
          <Col span={12}>
            <h2>Task Status</h2>
            <List
              itemLayout="horizontal"
              size="large"
              dataSource={this.state.tasks}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar size='large' icon='tool'/>}
                    title={item.name}
                    description={item.kf_id}
                  />
                  Status: {item.state}
                </List.Item>
              )}
            />
          </Col>

          <Col span={10}>
            <h2>Event History</h2>
            <Timeline>
              <Timeline.Item color='blue' dot={<Icon type="right" style={{ fontSize: '18px' }}/>}>Release Scheduled</Timeline.Item>
              <Timeline.Item color='green'>Release Tagger accepted task</Timeline.Item>
              <Timeline.Item color='green'>Cavatica Sync accepted task</Timeline.Item>
              <Timeline.Item color='green'>Portal ETL accepted task</Timeline.Item>
              <Timeline.Item color='blue' dot={<Icon type="right" style={{ fontSize: '18px' }}/>}>All tasks were accepted, starting run</Timeline.Item>
            </Timeline>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default Release;
