import React, {Component} from 'react';
import {Segment, Card, Header} from 'semantic-ui-react';
import NewReleaseForm from '../forms/NewReleaseForm';

class Planner extends Component {
  render() {
    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Header as="h2">Plan a New Release</Header>
          </Card.Content>
          <Card.Content>
            <NewReleaseForm />
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default Planner;
