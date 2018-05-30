import React, { Component } from 'react';
import axios from 'axios';
import { Alert, Button, Col, Divider, Icon, Card, Row } from 'antd';
import { UserContext } from '../contexts';
import { googleAppId } from '../globalConfig';


class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: {},
      loggedIn: false,
      token: null
    }
  }

  componentDidMount() {
    try {
      window.gapi.load('auth2', () => {
        global.gapi.auth2.init({
          client_id: googleAppId
        });

        global.gapi.signin2.render('googleSignin', {
          scope: 'profile email',
          width: 240,
          height: 40,
          longtitle: true,
          theme: 'light',
          onsuccess: googleUser => {
            const { id_token } = googleUser.getAuthResponse();
            this.onLogin(id_token);
          },
          onfailure: error => console.log('login fail', error),
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  onLogin(token) {
    this.props.googleToken = token;

    this.props.history.push('/status');
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <div id="googleSignin">Hello</div>
      </UserContext.Provider>
    );
  }
}

export default Login;
