import React, { Component } from 'react';
import { Alert, Card, Row, Col } from 'antd';
import Progress from '../components/Progress';


class Status extends Component {
  render() {
    return (
      <Card>
        <Col>
          <Row style={{margin: '10px 0'}}>
            <Alert
              message="System Status"
              description="Ready to create new release"
              type="success"
              showIcon
            />
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Alert
                message="Release Tagger"
                description="Determines the next version tag to apply to a release and applies it to all of the data within."
                type="success"
                showIcon
              />
            </Col>
            <Col span={8}>
              <Alert
                message="Cavatica Sync"
                description="Syncronizes file availability to Cavatica."
                type="success"
                showIcon
              />
            </Col>
            <Col span={8}>
              <Alert
                message="Elastic Search ETL"
                description="Builds Elastic Search indices for use by the portal."
                type="success"
                showIcon
              />
            </Col>
          </Row>
        </Col>
      </Card>
    );
  }
}

export default Status;
