import React, { Component } from 'react';
import axios from 'axios';
import { Button, Card, Divider, Input, Icon, Row, Col, Spin, Tag, Switch, Tooltip } from 'antd';
import TaskList from '../components/TaskList';
import StatusBadge from '../components/StatusBadge';
import Events from '../components/Events';
import { coordinatorApi } from '../globalConfig';
import { UserContext } from '../contexts';

const { TextArea } = Input;


class Service extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      service: {},
      events: [],
      updating: false,
      toggling: false
    };
  }

  componentWillMount() {
    axios.all([axios.get(`${coordinatorApi}/task-services/${this.props.match.params.serviceId}`),
               axios.get(`${coordinatorApi}/events?task_service=${this.props.match.params.serviceId}`)])
         .then(axios.spread((service, events) => {
            this.setState({
              service: service.data,
              events: events.data.results,
              loading: false,
              editing: false
            });
         }))
         .catch(error => console.log(error));
  }

  edit() {
    this.setState({editing: true});
  }

  update() {
    this.setState({editing: false, updating: true});
    const token = this.props.egoToken;
    const header = {headers: {Authorization: 'Bearer '+token}};
    axios.patch(`${coordinatorApi}/task-services/${this.state.service.kf_id}`, this.state.service, header)
      .then(resp => {
        this.setState({updating: false});
      });
  }

  updateName(ev) {
    let service = this.state.service;
    service.name = ev.target.value
    this.setState({service: service})
  }

  updateDescription(ev) {
    let service = this.state.service;
    service.description = ev.target.value
    this.setState({service: service})
  }

  toggle(enabled) {
    this.setState({toggling: true});
    const token = this.props.egoToken;
    const header = {headers: {Authorization: 'Bearer '+token}};
    axios.patch(`${coordinatorApi}/task-services/${this.state.service.kf_id}`,
                {enabled: enabled}, header)
      .then(resp => {
        let service = this.state.service;
        service.enabled = enabled
        this.setState({service: service, toggling: false});
      });
  }

  render() {
    if (this.state.loading) {
      return (<Spin tip='loading...'><Card style={{height: 300}}></Card></Spin>)
    }

    return (
      <Card title='Task Service'>
        <Row type="flex" justify="space-between">
          <Col>
            {!this.state.editing ? (
              <h3>{this.state.service.name}</h3>
            ) : (
              <Input value={this.state.service.name} onChange={ev => this.updateName(ev)}/>
            )}
            <Tag>{this.state.service.kf_id}</Tag>
            <h5><Icon type='calendar' /> Created At: <em>{Date(this.state.service.created_at)}</em></h5>
            <h5><Icon type='link' /> Endpoint: <em>{this.state.service.url}</em></h5>
            <h5><Icon type='user' /> Author: <em>{this.state.service.author}</em></h5>
          </Col>
          <Col>
            <Row type="flex" align="middle" gutter={16}>
              <Col align="middle">
                <b>Enabled: </b>
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="cross" />}
                  checked={this.state.service.enabled}
                  loading={this.state.toggling}
                  onChange={(enabled) => this.toggle(enabled)}
                  />
              </Col>
              <Col>
                <StatusBadge healthStatus={this.state.service.health_status} />
              </Col>
            </Row>
            <br />
            {!this.state.editing ? (
              <Button type="dashed" icon="edit" size='large'
                onClick={() => this.edit()}
                style={{float: 'right'}}
              >Edit</Button>
            ) : (
              <Button type="primary" icon="check" size='large'
                onClick={() => this.update()}
                style={{float: 'right'}}
                loading={this.state.updating}
              >Save</Button>
            )}
          </Col>
        </Row>
        <Row>
          <h5><Icon type='form' /> Description:</h5>
          {!this.state.editing ? (
          <p>
            {this.state.service.description}
          </p>
          ) : (
          <p>
            <TextArea placeholder="Autosize height based on content lines" autosize
              value={this.state.service.description}
              onChange={ev => this.updateDescription(ev)}/>
          </p>
          )}
        </Row>

        <Divider style={{margin: 0, marginBottom: '24px'}}/>

        <Row justify='space-around' type='flex'>
          <Col span={10}>
            <h2>Recent Tasks <span />
            <Tooltip title="Latest tasks run by this service">
              <Icon type='info-circle-o' />
            </Tooltip>
            </h2>
            <TaskList serviceId={this.state.service.kf_id} />
          </Col>
          <Col span={10}>
            <h2>Recent Events <span />
            <Tooltip title="Latest events reported by this service">
              <Icon type='info-circle-o' />
            </Tooltip>
            </h2>
            <Events events={this.state.events} />
          </Col>
        </Row>
      </Card>
    );
  }
}

function ServiceProps(props) {
  return (
    <UserContext.Consumer>
      {user => <Service{...props}
        user={user.user} egoToken={user.egoToken}/>}
    </UserContext.Consumer>
  )
};

export default ServiceProps;
