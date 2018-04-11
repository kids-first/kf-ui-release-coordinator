import React, { Component } from 'react';
import axios from 'axios';
import {
  Avatar, Card, Divider, Button, List, Badge, Row,
  Col, Spin, Timeline
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
      tasks: tasks
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

  getData() {
    if (!this.mounted || this.state.release.state == 'staged' || this.state.release.state == 'published') {
      return
    }
    let api = process.env.REACT_APP_COORDINATOR_API;
    axios.get(`${api}/releases/${this.props.match.params.releaseId}`)
      .then(resp => {
        let data = resp.data.results;
        this.setState({release: data, loading: false});
      });
    this.timer = setTimeout(() => this.getData(), 1000);
  }

  render() {
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
        <Divider />
        <Row justify='center' type='flex'>
          <Col span={22}>
            <Progress release={this.state.release}/>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16} type='flex' justify='space-around'>
        <ButtonGroup>
          {this.state.release.state == 'staged' &&
            <Button size='large' type='primary'>Publish</Button>
          }
          <Button size='large' type='danger'>Cancel</Button>
        </ButtonGroup>
        </Row>

        <Divider />
        <List
          itemLayout="vertical"
          size="large"
          dataSource={this.state.tasks}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon='tool'/>}
                title={item.name}
                description={item.kf_id}
              />
              {item.state}
            </List.Item>
          )}
        />
      </Card>
    );
  }
}

export default Release;
