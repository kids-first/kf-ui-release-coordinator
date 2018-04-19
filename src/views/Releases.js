import React, { Component } from 'react';
import { Button, Card, Divider, Icon} from 'antd';
import ReleaseTable from '../components/ReleaseTable';


class Releases extends Component {
  render() {
    return (
      <Card title='Kids First Data Releases'>
        <Button type="primary" size="large"
          onClick={() => this.props.history.push(`/planner`)}
          ><Icon type='calendar' />Plan a Release</Button>
        <Divider />
        <ReleaseTable />
      </Card>
    );
  }
}

export default Releases;
