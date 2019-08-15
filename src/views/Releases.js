import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Segment, Button, Card, Grid, Header, Icon} from 'semantic-ui-react';
import ReleasesContainer from '../containers/Releases';

class Releases extends Component {
  render() {
    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header as="h2" content="Kids First Data Releases" />
                </Grid.Column>
                <Grid.Column width={8} textAlign="right">
                  <Button
                    as={Link}
                    to="/planner"
                    size="large"
                    primary
                    icon
                    labelPosition="left"
                  >
                    <Icon name="calendar outline" />
                    Plan a Release
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
          <Card.Content>
            <ReleasesContainer />
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default Releases;
