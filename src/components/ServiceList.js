import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { List, Avatar } from 'antd';
import StatusBadge from '../components/StatusBadge';


class ServiceList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true
    }
  }

  componentWillMount() {
    let api = process.env.REACT_APP_COORDINATOR_API;
    axios.get(`${api}/task-services`)
      .then(resp => {
        let data = resp.data.results;
        this.setState({data: data, loading: false});
      });
  }

  render() {
    return (
      <List
       itemLayout="horizontal"
       dataSource={this.state.data}
       renderItem={item => (
         <List.Item>
           <List.Item.Meta
             avatar={<Avatar icon="tool"/>}
             title={<Link to={`/services/${item.kf_id}`}>{item.name}</Link>}
             description={item.description}
           />
           <StatusBadge healthStatus={item.health_status} />
        </List.Item>
      )}
      />
    );
  }
}

export default withRouter(ServiceList);
