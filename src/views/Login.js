import React, { Component } from 'react';
import { UserContext } from '../contexts';
import { Row, Col, Layout, Card } from 'antd';
import { googleAppId } from '../globalConfig';
import brand from '../brand.svg';


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
      <Layout style={{height:"100vh", background: "#2b388f"}}> 
        <Row type="flex" justify="space-around" align="middle" style={{height: "100vh", background: "#2b388f"}}>
          <Col>
            <Card bordered={false} cover={<img src={brand} alt="Kids First logo" style={{padding: "10px", background: "#e83a9c"}}/>}>
            <Card.Meta title="Kids First Release Coordinator" />
            <br />
            <div id="googleSignin" onClick={() => this.login()}></div>
            </Card>
          </Col>
        </Row>
      </Layout>
    )
  }
}


export default Login => (
  <UserContext.Consumer>
    {user => <LoginNoProps {...Login} onLogin={user.onLogin} />}
  </UserContext.Consumer>
);

// export default Login
