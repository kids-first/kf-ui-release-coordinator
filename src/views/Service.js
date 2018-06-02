import React, { Component } from 'react';
import axios from 'axios';
import { Card, Divider, Icon, Row, Col, Spin, Tag, Tooltip } from 'antd';
import TaskList from '../components/TaskList';
import StatusBadge from '../components/StatusBadge';
import Events from '../components/Events';
import { coordinatorApi } from '../globalConfig';


class Service extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      service: {},
      events: []
    };
  }

  componentWillMount() {
    axios.all([axios.get(`${coordinatorApi}/task-services/${this.props.match.params.serviceId}`),
               axios.get(`${coordinatorApi}/events?task_service=${this.props.match.params.serviceId}`)])
         .then(axios.spread((service, events) => {
            this.setState({
              service: service.data,
              events: events.data.results,
              loading: false
            });
         }))
         .catch(error => console.log(error));
  }

  render() {
    if (this.state.loading) {
      return (<Spin tip='loading...'><Card style={{height: 300}}></Card></Spin>)
    }

    return (
      <Card title={`Task Service - ${this.state.service.name}`}>
        <Row type="flex" justify="space-between">
          <Col>
            <h3 style={{display: "inline"}}>{this.state.service.name} </h3>
              <Tag>{this.state.service.kf_id}</Tag>
            <h5><Icon type='calendar' /> Created At: <em>{Date(this.state.service.created_at)}</em></h5>
            <h5><Icon type='link' /> Endpoint: <em>{this.state.service.url}</em></h5>
            <h5><Icon type='user' /> Author: <em>{this.state.service.author}</em></h5>
          </Col>
          <Col>
            <StatusBadge healthStatus={this.state.service.health_status} />
          </Col>
        </Row>
        <Row>
          <h5>Description:</h5>
          <p>
            {this.state.service.description}
          </p>
        </Row>

        <Divider style={{margin: 0, marginBottom: '24px'}}/>

        <Row justify='space-around' type='flex'>
          <Col span={10}>
            <h2>Recent Tasks <span />
            <Tooltip title="Latest tasks run by this service">
              <Icon type='info-circle-o' />
            </Tooltip>
            </h2>
            <TaskList serviceId={this.state.service.kf_id} />
          </Col>
          <Col span={10}>
            <h2>Recent Events <span />
            <Tooltip title="Latest events reported by this service">
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

export default Service;
