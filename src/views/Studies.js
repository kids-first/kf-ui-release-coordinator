import React, {Component} from 'react';
import {Segment, Button, Card, Grid, Header, Icon} from 'semantic-ui-react';
import StudiesContainer from '../containers/StudiesContainer';

class Studies extends Component {
  render() {
    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header as="h2">Kids First Studies</Header>
                </Grid.Column>
                <Grid.Column width={8} textAlign="right">
                  <Button primary size="large" icon labelPosition="left">
                    <Icon name="refresh" />
                    Sync Studies
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
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
