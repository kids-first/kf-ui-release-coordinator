import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'kf-uikit';
import {GoogleLogin} from 'react-google-login';
import {googleAppId} from '../globalConfig';
import {loginUser} from '../actions/auth';
import brand from '../brand.svg';

class Login extends Component {
  render() {
    return (
      <div className="h-screen bg-blue py-16 text-center">
        <center>
          <img src={brand} alt="Kids First logo" />
        </center>
        <h1 style={{color: '#fff'}}>Kids First Release Coordinator</h1>
        <br />
        <center>
          <GoogleLogin
            clientId={googleAppId}
            render={renderProps => (
              <Button
                size="large"
                className="my-2"
                onClick={renderProps.onClick}
              >
                Login with Ego
              </Button>
            )}
            onSuccess={googleUser => {
              const {id_token} = googleUser.getAuthResponse();
              this.props.login(id_token);
            }}
            onFailure={error => console.log('login fail', error)}
          />
          <br />
          <Button
            size="large"
            className="my-2"
            onClick={() => this.props.auth.login()}
          >
            Login with Auth0
          </Button>
        </center>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: user => dispatch(loginUser(user)),
  };
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
