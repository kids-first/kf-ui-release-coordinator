import React, {Fragment} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {NavLink} from 'react-router-dom';
import {Container, Dropdown, Label, Icon, Menu} from 'semantic-ui-react';

import {MY_PROFILE} from '../queries';

import logo from '../logo.svg';

const Nav = props => <NavLink exact {...props} activeClassName="active" />;

export const Header = () => {
  const {
    loading: profileLoading,
    error: profileError,
    data: profileData,
  } = useQuery(MY_PROFILE);

  const profile = profileData && profileData.myProfile;

  if (profileError) {
    console.log(profileError);
  }

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
        {profile && !profileLoading && !profileError && (
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
                    {profile.username}
                  </Fragment>
                }
                className="link item"
              >
                <Dropdown.Menu>
                  <Dropdown.Header>
                    {profile.roles.map((role, i) => (
                      <Label basic key={i} color="blue">
                        {role}
                      </Label>
                    ))}
                  </Dropdown.Header>
                  <Dropdown.Header>
                    {profile.groups.map((group, i) => (
                      <Label basic key={i} color="green">
                        {group}
                      </Label>
                    ))}
                  </Dropdown.Header>
                  <Dropdown.Item
                    as={Nav}
                    to="/login"
                    onClick={() => {
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
