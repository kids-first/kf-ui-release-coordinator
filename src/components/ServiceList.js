import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { List, Avatar, Icon, Switch } from 'antd';
import { coordinatorApi } from '../globalConfig';


class ServiceList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true
    }
  }

  componentWillMount() {
    this.getData();
  }

  getData() {
    axios.get(`${coordinatorApi}/task-services?${this.props.filters}`)
      .then(resp => {
        let data = resp.data.results;
        this.setState({data: data, loading: false});
      });
  }

  onChange(kf_id, state) {
    this.setState({loading: true});
    axios.patch(`${coordinatorApi}/task-services/${kf_id}`,
                {enabled: state})
      .then(resp => {
        this.getData();
      });
  }

  render() {

    const statusColors = {
      'ok': '#87d068',
      'bad': '#f50',
    };

    return (
      <List
       itemLayout="horizontal"
       dataSource={this.state.data}
       renderItem={item => (
         <List.Item>
           <div className='w-full'>
             <Avatar
               icon={item.health_status === 'ok' ? 'check' : 'warning'}
               style={{backgroundColor: statusColors[item.health_status], marginRight: '5px'}}/>
             <Link to={`/services/${item.kf_id}`}>{item.name}</Link> - 
             {item.description}
           </div>
           <div className='w-48'>
              <b>Enabled: </b>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="cross" />}
                checked={item.enabled}
                loading={this.state.loading}
                onChange={(enabled) => this.onChange(item.kf_id, enabled)}
                />
           </div>
        </List.Item>
      )}
      />
    );
  }
}

export default withRouter(ServiceList);
