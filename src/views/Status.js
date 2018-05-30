import React, { Component } from 'react';
import axios from 'axios';
import { Alert, Button, Col, Divider, Icon, Card, Row } from 'antd';
import ServiceList from '../components/ServiceList';
import Events from '../components/Events';
import { coordinatorApi } from '../globalConfig';
import { UserContext } from '../contexts';


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

        <UserContext.Consumer>
        {user => (
        <Card title={`Hello ${user.loggedIn}!`}>
          <Row gutter={16} justify="space-between" type="flex">
            <Button.Group size='large'>
              <Button
                href="/planner"
                type='primary'>
                <Icon type='calendar' />Plan a Release
              </Button>
              <Button
                href="/service/new"
                type='default'>
                <Icon type='tool' />Register a Task Service
              </Button>
            </Button.Group>
            <Button
              href="/logout"
              size='large'
              type='dashed'>
              <Icon type='logout' />Logout
            </Button>
          </Row>
        </Card>
        )}
        </UserContext.Consumer>

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
