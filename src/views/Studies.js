import React, {Component} from 'react';
import {Segment, Button, Icon} from 'semantic-ui-react';
import StudiesContainer from '../containers/StudiesContainer';

class Studies extends Component {
  render() {
    return (
      <Segment>
        <h1>Kids First Studies</h1>
        <hr />
        <StudiesContainer />
      </Segment>
    );
  }
}

export default Studies;
