import React from 'react';
import {Segment, Message, Step} from 'semantic-ui-react';

const Progress = props => {
  const stateOrder = {
    pending: 1,
    running: 2,
    staged: 3,
    publishing: 4,
    published: 5,
  };
  const state = stateOrder[props.release.state];

  const stateDescription = {
    waiting: {
      header: 'The release is waiting',
      content:
        'The release is waiting to be picked up by the Coordinator',
    },
    initializing: {
      header: 'The release is initializing',
      content:
        'The Coordinator is initializing Task services for the release',
    },
    pending: {
      header: 'The release is pending',
      content:
        'The release is waiting for services to confirm that they are ready to start processing a new release',
    },
    running: {
      header: 'The release is running',
      content: 'Release tasks are processing the release',
    },
    staged: {
      header: 'The release is staged',
      content:
        'All tasks have finished processing for the release. The release must be reviewed by an administrator before being published',
    },
    publishing: {
      header: 'The release is publishing',
      content: 'Final work is being done to make this release public',
    },
    published: {
      header: 'The release has been published',
      content:
        'This release has been published and should be accessible by the public',
    },
  };

  return (
    <Segment basic textAlign="left">
      <Step.Group fluid>
        <Step
          completed={state > 1}
          active={state === 1}
          disabled={state < 1}
          title="Pending"
          icon="time"
        />

        <Step
          completed={state > 2}
          active={state === 2}
          disabled={state < 2}
          title="Running"
          icon="ellipsis horizontal"
        />

        <Step
          completed={state > 3}
          active={state === 3}
          disabled={state < 3}
          title="Staged"
          icon="eye"
        />

        <Step
          completed={state > 4}
          active={state === 4}
          disabled={state < 4}
          title="Publishing"
          icon="ellipsis horizontal"
        />

        <Step
          completed={state > 5}
          active={state === 5}
          disabled={state < 5}
          title="Published"
          icon="bookmark"
        />
      </Step.Group>
      <Message info {...stateDescription[props.release.state]} />
    </Segment>
  );
};

export default Progress;
