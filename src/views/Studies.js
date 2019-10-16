import React, {useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {Segment, Button, Grid, Message, Header, Icon} from 'semantic-ui-react';
import StudiesContainer from '../containers/StudiesContainer';

import {SYNC_STUDIES} from '../mutations';

const Studies = () => {
  const [syncMessage, setSyncMessage] = useState();

  const [
    syncStudies,
    {loading: syncStudiesLoading, error: syncStudiesError},
  ] = useMutation(SYNC_STUDIES);

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
              <Button
                fluid
                icon
                primary
                size="large"
                labelPosition="left"
                loading={syncStudiesLoading}
                onClick={() => {
                  syncStudies().then(resp => {
                    const created = resp.data.syncStudies.new.edges.length;
                    const deleted = resp.data.syncStudies.deleted.edges.length;
                    setSyncMessage(
                      `${created} new studies found, ${deleted} studies deleted`,
                    );
                  });
                }}
              >
                <Icon name="refresh" />
                Sync Studies
              </Button>
            </Grid.Column>
          </Grid.Row>
          {syncStudiesError && (
            <Grid.Row>
              <Message
                negative
                header="Error"
                content={syncStudiesError.message}
              />
            </Grid.Row>
          )}
          {syncMessage && (
            <Grid.Row>
              <Message
                info
                fluid
                header="Studies Synchronized"
                content={syncMessage}
              />
            </Grid.Row>
          )}
        </Grid>
      </Segment>
      <Segment vertical>
        <StudiesContainer hideSync />
      </Segment>
    </>
  );
};

export default Studies;
