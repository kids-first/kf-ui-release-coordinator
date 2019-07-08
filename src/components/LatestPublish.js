import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {coordinatorApi} from '../globalConfig';
import {Icon, Item, Label, Loader} from 'semantic-ui-react';

const LatestReleases = props => {
  const [loading, setLoading] = useState(true);
  const [release, setRelease] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `${coordinatorApi}/releases?state=published&limit=1`,
      );
      setRelease(result.data.results[0]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Loader active inline="centered">
        Loading Latest Publication...
      </Loader>
    );
  } else {
    return (
      <center>
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
            </Item.Description>
          </Item.Content>
        </Item>
      </center>
    );
  }
};

export default LatestReleases;
