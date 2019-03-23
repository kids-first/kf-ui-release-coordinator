import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth0Login} from '../actions/auth';

class Callback extends Component {
  componentDidMount() {
    this.props.auth.handleAuthentication(this.props, this.props.auth0Login);
  }

  render() {
    return <h1>Redirecting...</h1>;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    auth0Login: (access_token, id_token) =>
      dispatch(auth0Login(access_token, id_token)),
  };
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Callback);
