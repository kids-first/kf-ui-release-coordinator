import React from 'react';
import WrappedNewServiceForm from '../forms/NewService';
import {Grid, Header, Message, Segment} from 'semantic-ui-react';

const NewService = props => (
  <Segment vertical>
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <Header as="h2" content="Register a New Task Service" />
        </Grid.Column>
      </Grid.Row>
    </Grid>
    <Message>
      Register a new task service by providing the task's endpoint. Any new task
      registered will immediatley be included in a new release. Ensure that the
      task service is up and accepting work correctly to ensure that releases do
      not fail.
    </Message>
    <WrappedNewServiceForm />
  </Segment>
);

export default NewService;
