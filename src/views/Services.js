import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {Row, Divider} from 'antd';
import {Button, Card} from 'kf-uikit';
import {coordinatorApi} from '../globalConfig';
import ServiceList from '../components/ServiceList';

class Services extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true
    };
  }

  componentWillMount() {
    axios.get(`${coordinatorApi}/task-services`).then(resp => {
      let data = resp.data.results;
      this.setState({data: data, loading: false});
    });
  }

  onChange(state) {
    console.log(state);
    axios.post(`${coordinatorApi}/task-services`).then(resp => {
      let data = resp.data.results;
      this.setState({data: data, loading: false});
    });
  }

  render() {
    return (
      <Card title="Kids First Data Release Task Services">
        <Row>
          <Link to="/service/new">
            <Button color="primary" size="large">
              Register New Service
            </Button>
          </Link>
        </Row>
        <Divider />
        <ServiceList />
      </Card>
    );
  }
}

export default withRouter(Services);
