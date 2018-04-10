import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Card } from 'antd';
import ReleaseTable from '../components/ReleaseTable';


class Releases extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card>
        <ReleaseTable />
      </Card>
    );
  }
}

export default Releases;
