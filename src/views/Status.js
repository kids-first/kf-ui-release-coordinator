import React, { Component } from 'react';
import { Alert, Button, Divider, Icon, Card, Row } from 'antd';
import ServiceList from '../components/ServiceList';


class Status extends Component {
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

        <Row>
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
        </Row>
        <Divider />
        <Row>
          <h2>Task Service Status</h2>
          <ServiceList />
        </Row>
      </Card>
    );
  }
}

export default Status;
