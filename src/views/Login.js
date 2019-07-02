import React from 'react';
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

const Login = props => (
  <Grid
    style={{
      backgroundImage:
        'linear-gradient(to bottom, #fff 400px, transparent 100%), url(https://portal.kidsfirstdrc.org/static/media/background-science.68317e4e.jpg)',
      height: '100vh',
    }}
    stretched
    textAlign="center"
    verticalAlign="middle"
  >
    <Grid.Column computer="8" tablet="12" mobile="15">
      <Segment>
        <Header as="h1">
          <Image src={brand} />
          <Header.Content>Kids First Release Coordinator</Header.Content>
        </Header>
        <Button.Group vertical size="large">
          <Button
            onClick={() => props.auth.login()}
            size="large"
            positive
            icon
            labelPosition="right"
          >
            Login with Auth0
            <Icon name="chevron right" />
          </Button>
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
              props.login(id_token);
            }}
            onFailure={error => console.log('login fail', error)}
          />
        </Button.Group>
        <Message content="Log in to the release coordinator to track and create new data releases for Kids First." />
      </Segment>
    </Grid.Column>
  </Grid>
);

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
