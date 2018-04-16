import React, { Component } from 'react';
import { Alert, Button, Divider, Icon, Card, Row, Col } from 'antd';
import Progress from '../components/Progress';
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
          <Button
            size='large'
            type='primary'>
            <Icon type='calendar' />Plan a Release
          </Button>
          <Divider />
          <h2>Task Service Status</h2>
            <ServiceList />
        </Row>
      </Card>
    );
  }
}

export default Status;
