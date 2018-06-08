import React, { Component } from 'react';
import { UserContext } from '../contexts';
import { Icon } from 'antd';
import { googleAppId } from '../globalConfig';


class LoginNoProps extends Component {

  componentDidMount() {
    try {
      global.gapi.load('auth2', () => {
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
            this.props.onLogin(id_token);
          },
          onfailure: error => console.log('login fail', error),
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div>
        <Icon type="loading" style={{ fontSize: 32 }} />
        <div id="googleSignin" onClick={() => this.login()}></div>
      </div>
    )
  }
}


export default Login => (
  <UserContext.Consumer>
    {user => <LoginNoProps {...Login} onLogin={user.onLogin} />}
  </UserContext.Consumer>
);

// export default Login
