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
               avatar={<Avatar icon="ellipsis"/>}
               title={item.kf_id}
               description={item.created_at}
             />
             <div>
              <Tag>{item.state}</Tag>
             </div>
          </List.Item>
        )}
        />
    );
  }
}

export default TaskList;
