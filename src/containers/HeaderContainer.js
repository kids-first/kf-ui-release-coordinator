import React, {Fragment} from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {auth0Logout} from '../actions/auth';
import {Container, Dropdown, Icon, Image, Menu} from 'semantic-ui-react';
import {syslevel} from '../globalConfig';
import logo from '../logo.svg';

const Nav = props => <NavLink exact {...props} activeClassName="active" />;

const HeaderContainer = ({...props}) => {
  return (
    <Fragment>
      <Menu attached="top">
        <Container>
          <Menu.Item header as={NavLink} to="/" activeClassName="">
            <Image src={logo} size="mini" />
            Release Coordinator
          </Menu.Item>
          <Menu.Item as={Nav} to="/" content="Status" />
          <Menu.Item as={Nav} to="/planner" content="Planner" />
          <Menu.Item as={Nav} to="/releases" content="Releases" />
          <Menu.Item as={Nav} to="/studies" content="Studies" />
          <Menu.Item as={Nav} to="/services" content="Services" />
          <Menu.Menu position="right">
            <Dropdown text={props.userName} className="link item">
              <Dropdown.Menu>
                <Dropdown.Item as={Nav} to="/profile">
                  <Icon name="user" />
                  Account
                </Dropdown.Item>
                <Dropdown.Item
                  as={Nav}
                  to="/"
                  onClick={() => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('persist:root');
                    window.location.reload();
                  }}
                >
                  <Icon name="log out" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Container>
      </Menu>
      {syslevel !== 'prd' && (
        <center>
          <h3
            style={{
              color: 'white',
              background: `${syslevel === 'qa' ? '#FE9A76' : '#008080'}`,
            }}
          >
            FYI, you're currently in the <b>{syslevel}</b> environment. Anything
            you do here will not be made public!
          </h3>
        </center>
      )}
    </Fragment>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      console.log('logout');
      dispatch(auth0Logout);
    },
  };
}

function mapStateToProps(state) {
  return {userName: state.auth.user.name};
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(HeaderContainer),
);
