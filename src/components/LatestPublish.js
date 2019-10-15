import React from 'react';
import {Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {Icon, Item, Label, Loader} from 'semantic-ui-react';

const LatestReleases = ({release, loading, error}) => {
  if (loading) {
    return (
      <Loader active inline="centered">
        Loading Latest Publication...
      </Loader>
    );
  }
  if (error) return <div>Problem getting latest published release</div>;
  if (!release) return <div>No published releases yet</div>;

  return (
    <center>
      <Item as={Link} to={`/releases/${release.kfId}`}>
        <Item.Content>
          <Item.Header>{release.name}</Item.Header>
          <Item.Meta>
            <TimeAgo date={new Date(release.createdAt)} />
          </Item.Meta>
          <Item.Description>
            <Label basic>
              <Icon name="tag" />
              {release.version}
            </Label>
          </Item.Description>
        </Item.Content>
      </Item>
    </center>
  );
};

export default LatestReleases;
