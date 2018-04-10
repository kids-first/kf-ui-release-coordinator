import React, { Component } from 'react';
import { Card } from 'antd';
import WrappedNewReleaseForm from '../forms/NewRelease';

class Planner extends Component {
  render() {
    return (
      <Card title="Create a new Release" bordered={false}>
        <WrappedNewReleaseForm />
      </Card>
    );
  }
}

export default Planner;
