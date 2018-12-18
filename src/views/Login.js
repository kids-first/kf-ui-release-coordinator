import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Layout} from 'antd';
import {googleAppId} from '../globalConfig';
import {loginUser} from '../actions/auth';
import brand from '../brand.svg';

class Login extends Component {
  componentDidMount() {
    try {
      global.gapi.load('auth2', () => {
        global.gapi.auth2.init({
          client_id: googleAppId,
        });

        global.gapi.signin2.render('googleSignin', {
          scope: 'profile email',
          width: 240,
          height: 40,
          longtitle: true,
          theme: 'light',
          onsuccess: googleUser => {
            const {id_token} = googleUser.getAuthResponse();
            this.props.login(id_token);
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
      <Layout style={{height: '100vh', background: '#2b388f'}}>
        <Row
          type="flex"
          justify="space-around"
          align="middle"
          style={{height: '100vh', background: '#2b388f'}}>
          <Col>
            <center>
              <img src={brand} alt="Kids First logo" />
            </center>
            <h1 style={{color: '#fff'}}>Kids First Release Coordinator</h1>
            <br />
            <center>
              <div id="googleSignin" />
            </center>
          </Col>
        </Row>
      </Layout>
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
