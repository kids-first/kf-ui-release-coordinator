import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Card} from 'kf-uikit';
import Tag from '../components/Tag';

class Profile extends Component {
  render() {
    const roles = this.props.user.roles.map((t, i) => (
      <Tag key={i} type="service">
        {t}
      </Tag>
    ));
    const groups = this.props.user.groups.map((t, i) => (
      <Tag key={i} type="task">
        {t}
      </Tag>
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
