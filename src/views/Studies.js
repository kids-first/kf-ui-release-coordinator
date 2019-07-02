import React, {Component} from 'react';
import {Segment, Button, Card, Header, Icon} from 'semantic-ui-react';
import StudiesContainer from '../containers/StudiesContainer';

class Studies extends Component {
  render() {
    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Header as="h2">
              Kids First Studies
              <Button floated="right" size="large">
                <Icon name="refresh" />
                Sync Studies
              </Button>
            </Header>
          </Card.Content>
          <Card.Content>
            <StudiesContainer />
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default Studies;
