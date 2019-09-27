import React from 'react';
import {
  Button,
  Grid,
  Header,
  Icon,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';
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
    <Grid.Column computer="6" tablet="6" mobile="15">
      <Segment>
        <Header as="h1">
          <Image src={brand} />
          <Header.Content>Kids First Release Coordinator</Header.Content>
        </Header>
        <Button.Group vertical size="large">
          <Button
            onClick={() => props.auth.login(props.location.pathname)}
            size="large"
            positive
            icon
            labelPosition="right"
          >
            Login with Auth0
            <Icon name="chevron right" />
          </Button>
        </Button.Group>
        <Message content="Log in to the release coordinator to track and create new data releases for Kids First." />
      </Segment>
    </Grid.Column>
  </Grid>
);

export default Login;
