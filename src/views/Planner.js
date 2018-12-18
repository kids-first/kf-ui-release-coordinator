import React, {Component} from 'react';
import {Button, Card} from 'kf-uikit';
import NewReleaseForm from '../forms/NewReleaseForm';

class Planner extends Component {
  render() {
    return (
      <Card title="Create a new Release">
        <NewReleaseForm />
      </Card>
    );
  }
}

export default Planner;
