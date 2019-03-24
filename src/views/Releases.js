import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Icon} from 'kf-uikit';
import ReleasesContainer from '../containers/Releases';

class Releases extends Component {
  render() {
    return (
      <Card title="Kids First Data Releases">
        <Link to="/planner">
          <Button color="primary" size="large">
            <Icon kind="add" />
            Plan a Release
          </Button>
        </Link>
        <hr />
        <ReleasesContainer />
      </Card>
    );
  }
}

export default Releases;
