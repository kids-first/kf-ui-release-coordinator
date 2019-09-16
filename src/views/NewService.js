import React, {Component} from 'react';
import axios from 'axios';
import WrappedNewServiceForm from '../forms/NewService';
import {Card, Grid, Header, Message, Segment} from 'semantic-ui-react';
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
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Header as="h2" content="Register a New Task Service" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Message>
              Register a new task service by providing the task's endpoint. Any
              new task registered will immediatley be included in a new release.
              Ensure that the task service is up and accepting work correctly to
              ensure that releases do not fail.
            </Message>
            <WrappedNewServiceForm />
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default Services;
