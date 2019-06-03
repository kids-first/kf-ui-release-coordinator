import React, {Component} from 'react';
import axios from 'axios';
import {Icon, Label, List, Loader} from 'semantic-ui-react';
import {coordinatorApi} from '../globalConfig';

class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      releaseId: props.releaseId | null,
      serviceId: props.serivceId | null,
      tasks: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps !== this.props) {
      this.getData();
      return true;
    } else {
      return false;
    }
  }

  getData() {
    let _id = this.props.serviceId
      ? this.props.serviceId
      : this.props.releaseId;
    let resource = this.props.serviceId
      ? '/tasks?task_service='
      : '/tasks?release=';
    axios.get(`${coordinatorApi}${resource}${_id}`).then(resp => {
      let data = resp.data.results;
      this.setState({tasks: data, loading: false});
      this.forceUpdate();
    });
  }

  render() {
    const stateColors = {
      initialized: 'blue',
      running: 'teal',
      staged: 'purple',
      publishing: 'teal',
      published: 'green',
      canceled: 'grey',
      failed: 'red',
    };

    if (this.state.loading) {
      return <Loader active>Loading...</Loader>;
    }

    return (
      <List>
        {this.state.tasks.map((task, i) => (
          <List.Item>
            <List.Content floated="right">
              <Label basic horizontal color={stateColors[task.state]}>
                {task.state}
              </Label>
            </List.Content>
            <List.Content>
              <Label color="teal" horizontal>
                <Icon name="calendar check" />
                {task.kf_id}
              </Label>
              {task.service_name}
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
  }
}

export default TaskList;
