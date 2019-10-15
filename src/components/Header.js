import React, {Fragment, useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import {Container, Dropdown, Label, Icon, Menu} from 'semantic-ui-react';
import axios from 'axios';

import logo from '../logo.svg';

const Nav = props => <NavLink exact {...props} activeClassName="active" />;

export const Header = () => {
  const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(user !== undefined);

  const getProfile = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      // Bit of a hack because the header may render before there is a token
      // in localStorage.
      setTimeout(getProfile, 1000);
    } else {
      axios
        .get('https://kids-first.auth0.com/userinfo', {
          headers: {Authorization: 'Bearer ' + token},
        })
        .then(resp => {
          setLoggedIn(true);
          setUser(resp.data);
        });
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Menu attached="top" size="large">
      <Container>
        <Menu.Item>
          <img
            src={logo}
            alt="Kids First logo"
            style={{margin: '-0.5em 0', width: '2.0em'}}
          />
        </Menu.Item>
        <Menu.Item header as={NavLink} to="/" activeClassName="">
          Release Coordinator
        </Menu.Item>
        {loggedIn && user && (
          <Fragment>
            <Menu.Item as={Nav} to="/" content="Status" />
            <Menu.Item as={Nav} to="/planner" content="Planner" />
            <Menu.Item as={Nav} to="/releases" content="Releases" />
            <Menu.Item as={Nav} to="/studies" content="Studies" />
            <Menu.Item as={Nav} to="/services" content="Services" />

            <Menu.Menu position="right">
              <Dropdown
                trigger={
                  <Fragment>
                    <Icon circular name="user" />
                    {user.nickname}
                  </Fragment>
                }
                className="link item"
              >
                <Dropdown.Menu>
                  <Dropdown.Header>
                    {user['https://kidsfirstdrc.org/roles'].map((role, i) => (
                      <Label basic key={i} color="blue">
                        {role}
                      </Label>
                    ))}
                  </Dropdown.Header>
                  <Dropdown.Header>
                    {user['https://kidsfirstdrc.org/groups'].map((role, i) => (
                      <Label basic key={i} color="green">
                        {role}
                      </Label>
                    ))}
                  </Dropdown.Header>
                  <Dropdown.Item
                    as={Nav}
                    to="/login"
                    onClick={() => {
                      setLoggedIn(false);
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('idToken');
                      localStorage.removeItem('egoToken');
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
          </Fragment>
        )}
      </Container>
    </Menu>
  );
};
