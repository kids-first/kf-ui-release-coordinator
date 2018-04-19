import React, { Component } from 'react';
import axios from 'axios';
import { Card, Divider, Button, Row, Col, Spin, Timeline, Icon, Tag
} from 'antd';
import Progress from '../components/Progress';
import TaskList from '../components/TaskList';
const ButtonGroup = Button.Group;


class Release extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      release: {},
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
        this.state.release.state === 'staged' ||
        this.state.release.state === 'published') {
      return
    }
    let api = process.env.REACT_APP_COORDINATOR_API;
    axios.get(`${api}/releases/${this.props.match.params.releaseId}`)
      .then(resp => {
        let data = resp.data;
        this.setState({release: data, loading: false});
        this.timer = setTimeout(() => this.getData(), 1000);
      });
  }

  render() {
    console.log(this.state);
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

    if (this.state.loading) {
      return (<Spin tip='loading...'><Card style={{height: 300}}></Card></Spin>)
    }
    return (
      <Card title={`Release ${this.props.match.params.releaseId} - ${this.state.release.name}`}>
        <Row>
          <Col>
            <h3 style={{display: "inline"}}>{this.state.release.name} </h3>
              <Tag>{this.state.release.kf_id}</Tag>
            <h5>Created At: {Date(this.state.release.created_at)}</h5>
          </Col>

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
              disabled={this.state.release.state !== 'staged'}>
              <Icon type='search'/>Preview in Portal
            </Button>
            <Button
              size='large'
              type='danger'
              disabled={this.state.release.state === 'published'
                        || this.state.release.state === 'publishing'}>
              <Icon type='close-circle'/>Cancel
            </Button>
          </ButtonGroup>
        </Row>

        <Divider />

        <Row justify='space-around' type='flex'>
          <Col span={12}>
            <h2>Task Status</h2>
            <TaskList releaseId={this.state.release.kf_id} />
          </Col>

          <Col span={10}>
            <h2>Event History</h2>
            <Timeline>
              <Timeline.Item color='blue' dot={<Icon type="right" style={{ fontSize: '18px' }}/>}>Release Scheduled</Timeline.Item>
              {(this.state.release.state === 'running' || this.state.release.state === 'staged' || this.state.release.state === 'publishing' || this.state.release.state === 'published') && (
                <div>
                <Timeline.Item color='green'>Release Tagger accepted task</Timeline.Item>
                <Timeline.Item color='green'>Cavatica Sync accepted task</Timeline.Item>
                <Timeline.Item color='green'>Portal ETL accepted task</Timeline.Item>
                <Timeline.Item color='blue' dot={<Icon type="right" style={{ fontSize: '18px' }}/>}>All tasks were accepted, starting run</Timeline.Item>
                <Timeline.Item color='green'>Release Tagger started task</Timeline.Item>
                <Timeline.Item color='green'>Cavatica Sync started task</Timeline.Item>
                <Timeline.Item color='green'>Portal ETL started task</Timeline.Item>
                </div>
              )}
              {(this.state.release.state === 'staged' || this.state.release.state === 'publishing' || this.state.release.state === 'published') && (
                <div>
                <Timeline.Item color='green'>Release Tagger finished task</Timeline.Item>
                <Timeline.Item color='green'>Cavatica Sync finished task</Timeline.Item>
                <Timeline.Item color='green'>Portal ETL finished task</Timeline.Item>
                <Timeline.Item color='blue' dot={<Icon type="right" style={{ fontSize: '18px' }}/>}>All tasks were finished. Wait for review</Timeline.Item>
                </div>
              )}
              {(this.state.release.state === 'publishing' || this.state.release.state === 'published') & (
                <div>
                <Timeline.Item color='blue' dot={<Icon type="right" style={{ fontSize: '18px' }}/>}>Positive review recieved. Publishing release</Timeline.Item>
                <Timeline.Item color='green'>Release Tagger started publishing</Timeline.Item>
                <Timeline.Item color='green'>Cavatica Sync started publishing</Timeline.Item>
                <Timeline.Item color='green'>Portal ETL started publishing</Timeline.Item>
                </div>
              )}
              {(this.state.release.state === 'published') && (
                <div>
                <Timeline.Item color='blue' dot={<Icon type="right" style={{ fontSize: '18px' }}/>}>Positive review recieved. Publishing release</Timeline.Item>
                <Timeline.Item color='green'>Release Tagger published</Timeline.Item>
                <Timeline.Item color='green'>Cavatica Sync published</Timeline.Item>
                <Timeline.Item color='green'>Portal ETL published</Timeline.Item>
                <Timeline.Item color='blue' dot={<Icon type="right" style={{ fontSize: '18px' }}/>}>All tasks completed. Release published</Timeline.Item>
                </div>
              )}
            </Timeline>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default Release;
