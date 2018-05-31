import React, { Component } from 'react';
import { Avatar, Button, Col, Layout, Tag, Icon, Row } from 'antd';
import { UserContext } from '../contexts';
const { Header } = Layout;

class UserCard extends Component {

  render() {
    return (
      <UserContext.Consumer>
      { user => (
          <Header style={{backgroundColor: '#fff'}}>
          <Row gutter={16} justify="space-between" type="flex">
            <Col>
            <Avatar icon="user" shape="square"
             style={{verticalAlign: 'middle', marginRight: 16}} size="large" />
            {user.user.name} <span></span>
            {user.user.roles.map(function(object, i){
              return <Tag key={i} color={object == 'USER' ? 'gold' : 'blue'}>{object}</Tag>;
            })}
            </Col>
            <Col>
              <Button.Group size='default'>
                <Button
                  href="/planner"
                  type='primary'>
                  <Icon type='calendar' />Plan a Release
                </Button>
                <Button
                  href="/service/new"
                  type='default'>
                  <Icon type='tool' />Register a Task Service
                </Button>
              <Button
                href="/logout"
                type='dashed'>
                <Icon type='logout' />Logout
              </Button>
              </Button.Group>
            </Col>
          </Row>
          </Header>
      )}
      </UserContext.Consumer>
    );
  }
}

export default UserCard;
