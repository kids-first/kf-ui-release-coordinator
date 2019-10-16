import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {Segment, Button, Grid, Header, Icon, Message} from 'semantic-ui-react';
import ReleaseList from '../components/ReleaseList';

import {ALL_RELEASES} from '../queries';

const Releases = props => {
  const {
    loading: releasesLoading,
    error: releasesError,
    data: releasesData,
  } = useQuery(ALL_RELEASES);

  const releases = releasesData && releasesData.allReleases;

  if (releasesError) {
    return <Message negative header="Error" content={releasesError} />;
  }

  return (
    <>
      <Segment vertical>
        <Grid columns={2} doubling>
          <Grid.Row>
            <Grid.Column width={12}>
              <Header
                as="h2"
                content="Kids First Data Releases"
                subheader="A list of all releases created within Kids First"
              />
            </Grid.Column>
            <Grid.Column textAlign="right" width={4}>
              <Button
                primary
                icon
                fluid
                as={Link}
                to="/planner"
                size="large"
                labelPosition="left"
              >
                <Icon name="calendar outline" />
                Plan a Release
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment vertical>
        <ReleaseList
          loading={releasesLoading}
          releases={releases && releases.edges}
        />
      </Segment>
    </>
  );
};

export default Releases;
