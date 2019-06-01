import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Button,
  Grid,
  Header,
  Icon,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';
import {GoogleLogin} from 'react-google-login';
import {googleAppId} from '../globalConfig';
import {loginUser} from '../actions/auth';
import brand from '../logo.svg';

class Login extends Component {
  render() {
    return (
      <Grid
        textAlign="center"
        style={{background: '#2b388f', height: '100vh'}}
        verticalAlign="middle"
      >
        <Grid.Column style={{maxWidth: 550}}>
          <Image src={brand} alt="Kids First logo" size="medium" centered />
          <Segment>
            <Header as="h1">Kids First Release Coordinator</Header>
            <Message
              info
              content="Log into the release coordinator to track and create new data releases for Kids First."
            />
            <GoogleLogin
              clientId={googleAppId}
              render={renderProps => (
                <Button
                  onClick={renderProps.onClick}
                  size="large"
                  icon
                  labelPosition="right"
                >
                  Login with Ego
                  <Icon name="chevron right" />
                </Button>
              )}
              onSuccess={googleUser => {
                const {id_token} = googleUser.getAuthResponse();
                this.props.login(id_token);
              }}
              onFailure={error => console.log('login fail', error)}
            />
            <Button
              onClick={() => this.props.auth.login()}
              size="large"
              positive
              icon
              labelPosition="right"
            >
              Login with Auth0
              <Icon name="chevron right" />
            </Button>
          </Segment>
        </Grid.Column>
      </Grid>
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
