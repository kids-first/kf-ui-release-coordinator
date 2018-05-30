import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { List, Avatar, Col, Row, Icon, Switch } from 'antd';
import StatusBadge from '../components/StatusBadge';
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
    axios.get(`${coordinatorApi}/task-services`)
      .then(resp => {
        let data = resp.data.results;
        this.setState({data: data, loading: false});
      });
  }

  onChange(kf_id, state) {
    this.setState({loading: true});
    axios.patch(`${coordinatorApi}/task-services/${kf_id}`, {enabled: state})
      .then(resp => {
        this.getData();
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
           <Row type="flex" align="middle" gutter={16}>
             <Col>
              <b>Enabled: </b>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="cross" />}
                checked={item.enabled}
                loading={this.state.loading}
                onChange={(enabled) => this.onChange(item.kf_id, enabled)}
                />
             </Col>
             <Col>
               <StatusBadge healthStatus={item.health_status} />
             </Col>
           </Row>
        </List.Item>
      )}
      />
    );
  }
}

export default withRouter(ServiceList);
