import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Segment, Button, Icon} from 'semantic-ui-react';
import ReleasesContainer from '../containers/Releases';

class Releases extends Component {
  render() {
    return (
      <Segment>
        <h1>Kids First Data Releases</h1>
        <hr />
        <Link to="/planner">
          <Button primary>
            <Icon name="calendar outline" />
            Plan a Release
          </Button>
        </Link>
        <ReleasesContainer />
      </Segment>
    );
  }
}

export default Releases;
