import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {
  Segment,
  Button,
  Card,
  Grid,
  Header,
  Icon,
  Message,
} from 'semantic-ui-react';
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
          <ReleaseList
            loading={releasesLoading}
            releases={releases && releases.edges}
          />
        </Card.Content>
      </Card>
    </Segment>
  );
};

export default Releases;
