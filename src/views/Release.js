import React, { Component } from 'react';
import { Card, Divider, Row, Col, Timeline } from 'antd';
import Progress from '../components/Progress';


class Home extends Component {
  constructor(props) {
    super(props)
    console.log(props.match);
  }
  render() {
    return (
      <Card>
        <Row justify='center' type='flex'>
          <Col span={22}>
            <Progress />
          </Col>
        </Row>
        <Divider />
         <Timeline pending="Polling...">
           <Timeline.Item color='green'>Release Tagger accepted task TA_AB1249E13B</Timeline.Item>
           <Timeline.Item color='green'>Cavatica Sync accepted task TA_19B93F34FC</Timeline.Item>
           <Timeline.Item color='green'>Portal ETL accepted task TA_BCC3914E3D</Timeline.Item>
         </Timeline>
      </Card>
    );
  }
}

export default Home;
