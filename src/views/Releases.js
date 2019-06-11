import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Segment, Button, Card, Header, Icon} from 'semantic-ui-react';
import ReleasesContainer from '../containers/Releases';

class Releases extends Component {
  render() {
    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Header as="h2">
              Kids First Data Releases
              <Button
                floated="right"
                as={Link}
                to="/planner"
                primary
                size="large"
              >
                <Icon name="calendar outline" />
                Plan a Release
              </Button>
            </Header>
          </Card.Content>
          <Card.Content extra>
            <ReleasesContainer />
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default Releases;
