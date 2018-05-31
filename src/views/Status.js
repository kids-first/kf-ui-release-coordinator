import React, { Component } from 'react';
import axios from 'axios';
import { Alert, Col, Divider, Card, Row } from 'antd';
import ServiceList from '../components/ServiceList';
import Events from '../components/Events';
import { coordinatorApi } from '../globalConfig';


class Status extends Component {

  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
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
    if (!this.mounted) {
      return
    }
    axios.get(`${coordinatorApi}/events?limit=5`)
         .then((events) => {
            this.setState({
              events: events.data.results,
            });
            this.timer = setTimeout(() => this.getData(), 1000);
         })
         .catch(error => console.log(error));
  }

  render() {
    return (
      <Card>
        <Row style={{margin: '10px 0'}}>
          <Alert
            message="System Status"
            description="Ready to create new release"
            type="success"
            showIcon
          />
        </Row>

        <Divider />

        <Row justify='space-around' type='flex'>
          <Col span={10}>
            <h2>Task Service Status</h2>
            <ServiceList />
          </Col>
          <Col span={10}>
            <h2>Recent Release Events</h2>
            <Events events={this.state.events} />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default Status;
