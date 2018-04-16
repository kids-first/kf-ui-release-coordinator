import React, { Component } from 'react';
import axios from 'axios';
import {
  Avatar, Card, Divider, Button, List, Badge, Row,
  Col, Spin, Timeline, Icon, Tag
} from 'antd';
import Progress from '../components/Progress';
import Tasks from '../components/Tasks';
import TaskList from '../components/TaskList';
const ButtonGroup = Button.Group;


class Service extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      service: {}
    };
  }

  componentWillMount() {
    let api = process.env.REACT_APP_COORDINATOR_API;
    axios.get(`${api}/task-services/${this.props.match.params.serviceId}`)
      .then(resp => {
        let data = resp.data;
        this.setState({service: data, loading: false});
      });
  }

  render() {
    if (this.state.loading) {
      return (<Spin tip='loading...'><Card style={{height: 300}}></Card></Spin>)
    }

    const health = this.state.service.health_status === 'ok' ? (
      <Tag color="#87d068"
        style={{fontSize: "22pt", padding: "10px", height: "38pt"}}
      >Status: <Icon type="check-circle" /></Tag>
    ) : (
      <Tag color="#f50"
        style={{fontSize: "22pt", padding: "10px", height: "38pt"}}
      >Status: <Icon type="warning" /></Tag>
    );

    return (
      <Card title={`Task Service - ${this.state.service.name}`}>
        <Row type="flex" justify="space-between">
          <Col>
            <h3 style={{display: "inline"}}>{this.state.service.name} </h3>
              <Tag>{this.state.service.kf_id}</Tag>
            <h5>Created At: {Date(this.state.service.created_at)}</h5>
            <h5>Endpoint: <em>{this.state.service.url}</em></h5>
          </Col>
          <Col>
            {health}
          </Col>
        </Row>
        <Row>
          <p>
            {this.state.service.description}
          </p>
        </Row>

        <Divider style={{margin: 0, marginBottom: '24px'}}/>

        <Row justify='space-around' type='flex'>
          <h3>Recent Tasks</h3>
          <Col span={24}>
            <TaskList serviceId={this.state.service.kf_id} />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default Service;
