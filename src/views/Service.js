import React, {Component} from 'react';
import axios from 'axios';
import TaskList from '../components/TaskList';
import Events from '../components/Events';
import {
  Segment,
  Button,
  Card,
  Dimmer,
  Divider,
  Grid,
  Header,
  Form,
  Icon,
  Image,
  Label,
  Loader,
  Message,
} from 'semantic-ui-react';
import {coordinatorApi} from '../globalConfig';
import paragraph from '../paragraph.png';

class Service extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: '',
      service: {},
      events: [],
      updating: false,
      toggling: false,
    };
  }

  componentWillMount() {
    axios
      .all([
        axios.get(
          `${coordinatorApi}/task-services/${
            this.props.match.params.serviceId
          }`,
        ),
        axios.get(
          `${coordinatorApi}/events?task_service=${
            this.props.match.params.serviceId
          }`,
        ),
      ])
      .then(
        axios.spread((service, events) => {
          this.setState({
            service: service.data,
            events: events.data.results,
            loading: false,
            editing: false,
          });
        }),
      )
      .catch(error => console.log(error));
  }

  edit() {
    this.setState({editing: true});
  }

  update() {
    this.setState({editing: false, updating: true, error: ''});
    axios
      .patch(
        `${coordinatorApi}/task-services/${this.state.service.kf_id}`,
        this.state.service,
      )
      .then(resp => {
        this.setState({updating: false});
      })
      .catch(err => {
        this.setState({
          updating: false,
          editing: true,
          error: JSON.stringify(err.response.data),
        });
      });
  }

  updateName(ev) {
    let service = this.state.service;
    service.name = ev.target.value;
    this.setState({service: service});
  }

  updateDescription(ev) {
    let service = this.state.service;
    service.description = ev.target.value;
    this.setState({service: service});
  }

  updateUrl(ev) {
    let service = this.state.service;
    service.url = ev.target.value;
    this.setState({service: service});
  }

  toggle(ev) {
    let enabled = !this.state.service.enabled;
    this.setState({toggling: true});
    axios
      .patch(`${coordinatorApi}/task-services/${this.state.service.kf_id}`, {
        enabled: enabled,
      })
      .then(resp => {
        let service = this.state.service;
        service.enabled = enabled;
        this.setState({service: service, toggling: false});
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <Segment basic>
          <Card fluid>
            <Card.Content>
              <Dimmer active inverted>
                <Loader active inverted>
                  Loading Service
                </Loader>
              </Dimmer>
              <Image src={paragraph} alt="loading" />
            </Card.Content>
          </Card>
        </Segment>
      );
    }

    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header as="h2">
                    {this.state.service.name}
                    <Header.Subheader>
                      <Label basic>
                        <Icon name="settings" />
                        {this.state.service.kf_id}
                      </Label>
                    </Header.Subheader>
                  </Header>
                </Grid.Column>
                <Grid.Column width={8} floated="right" textAlign="right">
                  <Form>
                    <Form.Field>
                      <label>Enabled: </label>
                      <Form.Checkbox
                        toggle
                        checked={this.state.service.enabled}
                        onChange={ev => this.toggle(ev)}
                      />
                    </Form.Field>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Form>
              <Form.Field>
                <label>Status:</label>
                <Label basic>{this.state.service.health_status}</Label>
              </Form.Field>
              <Form.Field>
                <label>Author</label>
                {this.state.service.author}
              </Form.Field>
              <Form.Group widths="equal">
                <Form.Field>
                  <label>Name</label>
                  <input
                    disabled={!this.state.editing}
                    name="name"
                    type="text"
                    value={this.state.service.name}
                    onChange={ev => this.updateName(ev)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Endpoint</label>
                  <input
                    disabled={!this.state.editing}
                    name="url"
                    type="text"
                    value={this.state.service.url}
                    onChange={ev => this.updateUrl(ev)}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <label>Description</label>
                <Form.TextArea
                  disabled={!this.state.editing}
                  value={this.state.service.description}
                  onChange={ev => this.updateDescription(ev)}
                />
              </Form.Field>
              {!this.state.editing ? (
                <Button onClick={() => this.edit()}>Edit</Button>
              ) : (
                <Button
                  loading={this.state.updating}
                  onClick={() => this.update()}
                >
                  Save
                </Button>
              )}
              {this.state.error && (
                <Message negative content={this.state.error} />
              )}
            </Form>
            <Divider />
            <h2>Recent Tasks</h2>
            <TaskList serviceId={this.state.service.kf_id} />

            <Divider />
            <h2>Recent Events</h2>
            <Events events={this.state.events} />
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default Service;
