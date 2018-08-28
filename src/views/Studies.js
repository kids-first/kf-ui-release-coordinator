import React, { Component } from 'react';
import { Card } from 'antd';
import StudyTable from '../components/StudyTable';


class Studies extends Component {
  render() {
    return (
      <Card title='Kids First Studies'>
        <StudyTable />
      </Card>
    );
  }
}

export default Studies;
