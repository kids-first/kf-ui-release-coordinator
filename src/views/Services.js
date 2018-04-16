import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Card, Row, Button, Divider } from 'antd';
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
    let api = process.env.REACT_APP_COORDINATOR_API;
    axios.get(`${api}/task-services`)
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
