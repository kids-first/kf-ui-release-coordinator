import React, {Component} from 'react';
import axios from 'axios';
import TaskList from '../components/TaskList';
import StatusBadge from '../components/StatusBadge';
import Events from '../components/Events';
import {Button, Card} from 'kf-uikit';
import Tag from '../components/Tag';
import {coordinatorApi} from '../globalConfig';

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
      return <Card className="min-h-screen">Loading</Card>;
    }

    return (
      <Card title="Task Service">
        <div>
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
          <StatusBadge healthStatus={this.state.service.health_status} />
        </div>
        <hr />
        <div>
          <Tag type="service">{this.state.service.kf_id}</Tag>
          {!this.state.editing ? (
            <span className="text-xl">{this.state.service.name}</span>
          ) : (
            <input
              className="text-xl border border border-mediumGrey"
              name="name"
              type="text"
              value={this.state.service.name}
              onChange={ev => this.updateName(ev)}
            />
          )}
          <br />
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
        </div>
        <div>
          <span>Description:</span>
          {!this.state.editing ? (
            <p>{this.state.service.description}</p>
          ) : (
            <p>
              <input
                className="w-full p-2 border border border-mediumGrey"
                name="description"
                type="text-area"
                value={this.state.service.description}
                onChange={ev => this.updateDescription(ev)}
              />
            </p>
          )}
        </div>

        <hr />

        <div className="w-full flex justify-around">
          <div className="w-1/2">
            <h2>Recent Tasks</h2>
            <TaskList serviceId={this.state.service.kf_id} />
          </div>
          <div className="w-1/2">
            <h2>Recent Events</h2>
            <Events events={this.state.events} />
          </div>
        </div>
      </Card>
    );
  }
}

export default Service;
