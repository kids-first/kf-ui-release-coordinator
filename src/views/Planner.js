import React, { Component } from 'react';
import { Card } from 'kf-uikit';
import WrappedNewReleaseForm from '../forms/NewRelease';

class Planner extends Component {
  render() {
    return (
      <Card title="Create a new Release">
        <WrappedNewReleaseForm />
      </Card>
    );
  }
}

export default Planner;
