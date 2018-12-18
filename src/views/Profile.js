import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from "react-router-dom";
import { Tag } from 'antd';
import { Card } from 'kf-uikit';

class Profile extends Component {

  render() {
    const roles = this.props.user.roles.map((t, i) => (
      <Tag key={i} color='blue'>{t}</Tag>
    ));
    const groups = this.props.user.groups.map((t, i) => (
      <Tag key={i} color='green'>{t}</Tag>
    ));
    return (
        <Card title={this.props.user.name}>
          <h5>Roles: {roles}</h5>
          <h5>Groups: {groups}</h5>
        </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return {user: state.auth.user};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Profile));
