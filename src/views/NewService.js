import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { Alert, Card, List, Avatar, Row, Col, Button } from 'antd';
import WrappedNewServiceForm from '../forms/NewService';


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
      <Card title='Register new task service'>
        <Row>
          <Alert message="Warning" description="
            Register a new task service by providing the task's endpoint.
            Any new task registered will immediatley be included in a new release.
            Ensure that the task service is up and accepting work correctly to
            ensure that releases do not fail.
            " type="warning" />
        </Row>
        <Row>
          <WrappedNewServiceForm />
        </Row>
      </Card>
    );
  }
}

export default Services;
