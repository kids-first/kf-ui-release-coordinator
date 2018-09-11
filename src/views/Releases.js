import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Divider, Icon} from 'antd';
import { Button } from 'kf-uikit';
import ReleaseTable from '../components/ReleaseTable';


class Releases extends Component {
  render() {
    return (
      <Card title='Kids First Data Releases'>
        <Link to='/planner'>
          <Button
            color="primary"
            size="large"
          >
            <Icon type='calendar' />Plan a Release
          </Button>
        </Link>
        <Divider />
        <ReleaseTable />
      </Card>
    );
  }
}

export default Releases;
