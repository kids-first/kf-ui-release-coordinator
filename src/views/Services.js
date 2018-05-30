import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Card, Row, Button, Divider } from 'antd';
import { coordinatorApi } from '../globalConfig';
import ServiceList from '../components/ServiceList';


class Services extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true
    }
  }

  componentWillMount() {
    axios.get(`${coordinatorApi}/task-services`)
      .then(resp => {
        let data = resp.data.results;
        this.setState({data: data, loading: false});
      });
  }

  onChange(state) {
    console.log(state);
    axios.post(`${coordinatorApi}/task-services`, )
      .then(resp => {
        let data = resp.data.results;
        this.setState({data: data, loading: false});
      });
  }

  render() {
    return (
      <Card title='Kids First Data Release Task Services'>
        <Row>
          <Button type="primary" size="large"
            onClick={() => this.props.history.push(`/service/new`)}
            >Register New Service</Button>
        </Row>
        <Divider />
        <ServiceList />
      </Card>
    );
  }
}

export default withRouter(Services);
