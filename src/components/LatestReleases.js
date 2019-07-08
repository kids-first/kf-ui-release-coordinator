import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {coordinatorApi} from '../globalConfig';
import {Grid, Icon, Item, Label, Loader} from 'semantic-ui-react';

const LatestReleases = props => {
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState([]);

  const stateColors = {
    initialized: 'blue',
    running: 'teal',
    staged: 'purple',
    publishing: 'teal',
    published: 'green',
    canceled: 'grey',
    failed: 'red',
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`${coordinatorApi}/releases?limit=5`);
      setReleases(result.data.results.reverse());
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Grid columns={5} divided>
        <Grid.Row>
          {[1, 2, 3, 4, 5].map(i => (
            <Grid.Column key={i}>
              {i === 3 && (
                <Loader active inline="centered">
                  Loading Latest Releases...
                </Loader>
              )}
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    );
  } else {
    return (
      <Grid columns={5} divided>
        <Grid.Row>
          {releases.map((release, i) => (
            <Grid.Column key={i} textAlign="center">
              <Item as={Link} to={`/releases/${release.kf_id}`}>
                <Item.Content>
                  <Item.Header>{release.name}</Item.Header>
                  <Item.Meta>
                    <TimeAgo date={new Date(release.created_at)} />
                  </Item.Meta>
                  <Item.Description>
                    <Label basic>
                      <Icon name="tag" />
                      {release.version}
                    </Label>
                    <Label basic color={stateColors[release.state]}>
                      {release.state}
                    </Label>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    );
  }
};

export default LatestReleases;
