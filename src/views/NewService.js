import React, {Component} from 'react';
import axios from 'axios';
import WrappedNewServiceForm from '../forms/NewService';
import {Card} from 'semantic-ui-react';
import {coordinatorApi} from '../globalConfig';

class Services extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
    };
  }

  componentWillMount() {
    axios.get(`${coordinatorApi}/task-services`).then(resp => {
      let data = resp.data.results;
      this.setState({data: data, loading: false});
    });
  }

  render() {
    return (
      <Card title="Register new task service">
        <div className="p-2 w-full border-2 border-mediumGrey">
          <h3 className="m-0">Creating a New Task</h3>
          Register a new task service by providing the task's endpoint. Any new
          task registered will immediatley be included in a new release. Ensure
          that the task service is up and accepting work correctly to ensure
          that releases do not fail.
        </div>
        <WrappedNewServiceForm />
      </Card>
    );
  }
}

export default Services;
