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
  Icon,
  Image,
  Label,
  Loader,
} from 'semantic-ui-react';
import {coordinatorApi} from '../globalConfig';
import paragraph from '../paragraph.png';

class Service extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
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
    this.setState({editing: false, updating: true});
    axios
      .patch(
        `${coordinatorApi}/task-services/${this.state.service.kf_id}`,
        this.state.service,
      )
      .then(resp => {
        this.setState({updating: false});
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

  toggle(ev) {
    let enabled = ev.target.checked;
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
            {!this.state.editing ? (
              <Button type="dashed" onClick={() => this.edit()}>
                Edit
              </Button>
            ) : (
              <Button type="primary" onClick={() => this.update()}>
                Save
              </Button>
            )}
            <b>Enabled: </b>
            <input type="checkbox" onChange={ev => this.toggle(ev)} />
            <Label basic>{this.state.service.health_status}</Label>
            <Label color="purple">
              <Icon name="settings" />
              {this.state.service.kf_id}
            </Label>
            {!this.state.editing ? (
              <span>{this.state.service.name}</span>
            ) : (
              <input
                name="name"
                type="text"
                value={this.state.service.name}
                onChange={ev => this.updateName(ev)}
              />
            )}
            <Divider />
            <span>
              Created At: <em>{Date(this.state.service.created_at)}</em>
            </span>
            <br />
            <span>
              Endpoint: <em>{this.state.service.url}</em>
            </span>
            <br />
            <span>
              Author: <em>{this.state.service.author}</em>
            </span>
            <span>Description:</span>
            {!this.state.editing ? (
              <p>{this.state.service.description}</p>
            ) : (
              <p>
                <input
                  name="description"
                  type="text-area"
                  value={this.state.service.description}
                  onChange={ev => this.updateDescription(ev)}
                />
              </p>
            )}

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
