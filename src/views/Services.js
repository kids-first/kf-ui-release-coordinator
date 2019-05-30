import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {Segment, Button, Icon} from 'semantic-ui-react';
import {coordinatorApi} from '../globalConfig';
import ServiceList from '../components/ServiceList';

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

  onChange(state) {
    console.log(state);
    axios.post(`${coordinatorApi}/task-services`).then(resp => {
      let data = resp.data.results;
      this.setState({data: data, loading: false});
    });
  }

  render() {
    return (
      <Segment>
        <h1>Kids First Data Release Task Services</h1>
        <hr />
        <Link to="/service/new">
          <Button color="primary">
            <Icon name="server" />
            Register New Service
          </Button>
        </Link>
        <ServiceList />
      </Segment>
    );
  }
}

export default withRouter(Services);
