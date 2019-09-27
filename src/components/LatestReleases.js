import React from 'react';
import {Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {Grid, Icon, Item, Label, Loader} from 'semantic-ui-react';

const LatestReleases = ({releases, loading, error}) => {
  const stateColors = {
    initialized: 'blue',
    running: 'teal',
    staged: 'purple',
    publishing: 'teal',
    published: 'green',
    canceled: 'grey',
    failed: 'red',
  };

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
  }
  return (
    <Grid columns={5} divided>
      <Grid.Row>
        {releases.map(({node}) => (
          <Grid.Column key={node.kfId} textAlign="center">
            <Item as={Link} to={`/releases/${node.kfId}`}>
              <Item.Content>
                <Item.Header>{node.name}</Item.Header>
                <Item.Meta>
                  <TimeAgo date={new Date(node.createdAt)} />
                </Item.Meta>
                <Item.Description>
                  <Label basic>
                    <Icon name="tag" />
                    {node.version}
                  </Label>
                  <Label basic color={stateColors[node.state]}>
                    {node.state}
                  </Label>
                </Item.Description>
              </Item.Content>
            </Item>
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  );
};

export default LatestReleases;
