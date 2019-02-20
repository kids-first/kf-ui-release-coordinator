import React, {Component} from 'react';
import {Card} from 'kf-uikit';
import StudiesContainer from '../containers/StudiesContainer';

class Studies extends Component {
  render() {
    return (
      <Card title="Kids First Studies">
        <StudiesContainer />
      </Card>
    );
  }
}

export default Studies;
