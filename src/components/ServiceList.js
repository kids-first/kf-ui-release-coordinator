import React, {Component} from 'react';
import axios from 'axios';
import {Link, withRouter} from 'react-router-dom';
import {Icon} from 'kf-uikit';
import {coordinatorApi} from '../globalConfig';

class ServiceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData() {
    axios
      .get(`${coordinatorApi}/task-services?${this.props.filters}`)
      .then(resp => {
        let data = resp.data.results;
        this.setState({data: data, loading: false});
      });
  }

  onChange(kf_id, state) {
    this.setState({loading: true});
    axios
      .patch(`${coordinatorApi}/task-services/${kf_id}`, {
        enabled: state.target.checked,
      })
      .then(resp => {
        this.getData();
      });
  }

  render() {
    return (
      <ul className="list-reset w-full max-w-full">
        {this.state.data.map(item => (
          <li className="w-full inline-block" key={item.kf_id}>
            <div className="inline-block w-8 h-8 border border-2 border-darkGrey mr-2 text-center rounded-full">
              {item.health_status === 'ok' ? (
                <Icon kind="star" width={20} />
              ) : (
                <Icon kind="close" width={20} />
              )}
            </div>
            <Link to={`/services/${item.kf_id}`}>{item.name}</Link> -
            <span className="font-normal">{item.description}</span>
            <div className="float-right">
              <b>Enabled: </b>
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={enabled => this.onChange(item.kf_id, enabled)}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

export default withRouter(ServiceList);
