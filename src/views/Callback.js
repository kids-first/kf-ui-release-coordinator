import React, {Component} from 'react';

class Callback extends Component {
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const from = params.get('from');
    this.props.auth.handleAuthentication(this.props, from);
  }

  render() {
    return <h1>Redirecting...</h1>;
  }
}
export default Callback;
