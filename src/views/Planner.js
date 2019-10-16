import React from 'react';
import {Segment, Header} from 'semantic-ui-react';
import NewReleaseForm from '../forms/NewReleaseForm';

const Planner = () => (
  <>
    <Segment vertical>
      <Header as="h2" icon="calendar outline" content="Plan a New Release" />
    </Segment>
    <Segment vertical>
      <NewReleaseForm />
    </Segment>
  </>
);

export default Planner;
