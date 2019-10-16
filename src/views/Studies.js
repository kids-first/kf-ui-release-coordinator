import React, {Component} from 'react';
import {Segment, Button, Grid, Header, Icon} from 'semantic-ui-react';
import StudiesContainer from '../containers/StudiesContainer';

class Studies extends Component {
  render() {
    return (
      <>
        <Segment vertical>
          <Grid columns={2} doubling>
            <Grid.Row>
              <Grid.Column width={12}>
                <Header
                  as="h2"
                  content="Kids First Studies"
                  subheader="All studies that the coordinator is aware of. New studies in the Data Service may require synchronizing"
                />
              </Grid.Column>
              <Grid.Column textAlign="right" width={4}>
                <Button fluid icon primary size="large" labelPosition="left">
                  <Icon name="refresh" />
                  Sync Studies
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment vertical>
          <StudiesContainer />
        </Segment>
      </>
    );
  }
}

export default Studies;
