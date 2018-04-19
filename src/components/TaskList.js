import React, { Component } from 'react';
import axios from 'axios';
import { Avatar, Card, List, Spin, Tag } from 'antd';


class TaskList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      tasks: []
    };
  }

  componentWillMount() {
    let api = process.env.REACT_APP_COORDINATOR_API;
    axios.get(`${api}/task-services/${this.props.serviceId}`)
      .then(resp => {
        let data = resp.data.tasks;
        this.setState({tasks: data, loading: false});
      });
  }

  whatIcon(state) {
    var icon = '';
    switch (state) {
      case 'pending':
      case 'waiting':
        icon = 'ellipsis';
        break;
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
    }
    return icon;
  }

  whatColor(state) {
    var color = '';
    switch (state) {
      case 'pending':
      case 'waiting':
        color = null;
        break;
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
    }
    return color;
  }

  render() {
    if (this.state.loading) {
      return (<Spin tip='loading...'><Card style={{height: 300}}></Card></Spin>)
    }


    return (
        <List
         itemLayout="horizontal"
         dataSource={this.state.tasks}
         renderItem={item => (
           <List.Item>
             <List.Item.Meta
               avatar={<Avatar
                        style={{ backgroundColor: this.whatColor(item.state)}}
                        icon={this.whatIcon(item.state)}/>}
               title={item.kf_id}
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
