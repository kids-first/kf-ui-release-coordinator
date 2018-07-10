import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Card, Icon, Tag } from 'antd';
import { dataserviceApi } from '../globalConfig';
import { UserContext } from '../contexts';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
		}
  }

  componentDidMount() {
    axios.get(`${dataserviceApi}/studies?limit=100`)
      .then(resp => {
        let studies = resp.data.results.map((s, i) => ({
          key: s.kf_id,
          title: s.kf_id,
          description: `${s.name}`,
          chosen: false
        }));
        this.setState({data: studies, loading: false, error: '', tags: []});
      });
  }

  render() {
    const roles = this.props.user.roles.map((t, i) => (
      <Tag key={i} color='blue'>{t}</Tag>
    ));
    const groups = this.props.user.groups.map((t, i) => (
      <Tag key={i} color='green'>{t}</Tag>
    ));
    return (
        <Card>
          <h3><Icon type='user' /> {this.props.user.name}</h3>

          <h5>Roles: {roles}</h5>
          <h5>Groups: {groups}</h5>
        </Card>
    );
  }
}

function ProfileProps(props) {
  return (
    <UserContext.Consumer>
      {user => <Profile {...props}
        user={user.user} egoToken={user.egoToken}/>}
    </UserContext.Consumer>
  )
};

export default withRouter(ProfileProps);
