import React, {Component} from 'react';
import {Card} from 'kf-uikit';
import {Segment} from 'semantic-ui-react';
import NewReleaseForm from '../forms/NewReleaseForm';

class Planner extends Component {
  render() {
    return (
      <Segment>
        <NewReleaseForm />
      </Segment>
    );
  }
}

export default Planner;
