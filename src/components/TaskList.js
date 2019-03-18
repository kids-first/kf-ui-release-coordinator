import React, {Component} from 'react';
import axios from 'axios';
import {Avatar, Card, List, Spin, Tag} from 'antd';
import {coordinatorApi} from '../globalConfig';

class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      releaseId: props.releaseId | null,
      serviceId: props.serivceId | null,
      tasks: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps !== this.props) {
      this.getData();
      return true;
    } else {
      return false;
    }
  }

  getData() {
    let _id = this.props.serviceId
      ? this.props.serviceId
      : this.props.releaseId;
    let resource = this.props.serviceId
      ? '/tasks?task_service='
      : '/tasks?release=';
    axios.get(`${coordinatorApi}${resource}${_id}`).then(resp => {
      let data = resp.data.results;
      this.setState({tasks: data, loading: false});
      this.forceUpdate();
    });
  }

  whatIcon(state) {
    var icon = '';
    switch (state) {
      case 'running':
      case 'publishing':
        icon = 'loading';
        break;
      case 'canceled':
        icon = 'close';
        break;
      case 'failed':
        icon = 'exclamation';
        break;
      case 'published':
        icon = 'check';
        break;
      default:
        icon = 'ellipsis';
        break;
    }
    return icon;
  }

  whatColor(state) {
    var color = '';
    switch (state) {
      case 'running':
      case 'publishing':
        color = 'orange';
        break;
      case 'canceled':
        color = 'magenta';
        break;
      case 'failed':
        color = 'blue';
        break;
      case 'published':
        color = 'green';
        break;
      default:
        color = null;
        break;
    }
    return color;
  }

  render() {
    if (this.state.loading) {
      return (
        <Spin tip="loading...">
          <Card style={{height: 300}} />
        </Spin>
      );
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={this.state.tasks}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{backgroundColor: this.whatColor(item.state)}}
                  icon={this.whatIcon(item.state)}
                />
              }
              title={`${item.service_name}: ${item.kf_id}`}
              description={item.created_at}
            />
            <div>
              <Tag color={this.whatColor(item.state)}>{item.state}</Tag>
            </div>
          </List.Item>
        )}
      />
    );
  }
}

export default TaskList;
