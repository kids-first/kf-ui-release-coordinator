import React, {Component} from 'react';
import axios from 'axios';
import className from 'classnames';
import Tag from './Tag';
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
    if (this.state.loading) {
      return <div className="bg-lightGrey w-full h-full">Loading</div>;
    }

    return (
      <ul className="list-reset">
        {this.state.tasks.map((task, i) => (
          <li
            key={task.kf_id}
            className={className('p-2 border border-lightGrey', {
              'bg-lightGrey': i % 2,
            })}
          >
            <Tag type="service">{task.kf_id}</Tag>
            <span className="font-semibold">{task.service_name}</span>
            <span className="float-right">
              <Tag state={task.state}>{task.state}</Tag>
            </span>
          </li>
        ))}
      </ul>
    );
  }
}

export default TaskList;
