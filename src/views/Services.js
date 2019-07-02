import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {Segment, Button, Card, Grid, Header, Icon} from 'semantic-ui-react';
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
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header as="h2">Kids First Release Task Services</Header>
                </Grid.Column>
                <Grid.Column width={8} textAlign="right">
                  <Button
                    as={Link}
                    to="/service/new"
                    primary
                    size="large"
                    icon
                    labelPosition="left"
                  >
                    <Icon name="settings" />
                    Register a Service
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
          <Card.Content extra>
            <ServiceList />
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default withRouter(Services);
