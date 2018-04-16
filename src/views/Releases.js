import React, { Component } from 'react';
import { Card } from 'antd';
import ReleaseTable from '../components/ReleaseTable';


class Releases extends Component {
  render() {
    return (
      <Card title='Kids First Data Releases'>
        <ReleaseTable />
      </Card>
    );
  }
}

export default Releases;
