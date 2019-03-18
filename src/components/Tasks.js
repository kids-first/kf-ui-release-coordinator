import React, {Component} from 'react';
import {Avatar, List} from 'antd';

class Tasks extends Component {
  constructor(props) {
    super(props);
    let tasks = [
      {
        kf_id: 'TA_DVV673SB',
        name: 'Release Tagger',
        state: 'ok'
      },
      {
        kf_id: 'TA_YW6XBRST',
        name: 'Cavatica Sync',
        state: 'ok'
      },
      {
        kf_id: 'TA_FTDDYNM8',
        name: 'Portal ETL',
        state: 'ok'
      }
    ];
    this.state = {
      tasks: tasks
    };
  }

  render() {
    return (
      <List
        itemLayout="horizontal"
        size="large"
        dataSource={this.state.tasks}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar size="large" icon="tool" />}
              title={item.name}
              description={item.kf_id}
            />
            Status: {item.state}
          </List.Item>
        )}
      />
    );
  }
}

export default Tasks;
