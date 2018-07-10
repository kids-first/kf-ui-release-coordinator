import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import brand from '../brand.svg';
const { Sider, Footer } = Layout;

class Nav extends Component {
  render() {
    return (
			<Sider trigger={null} width={300} breakpoint='lg' collapsible={true}>
				<img alt='release coordinator' src={brand} width='100%' style={{marginBottom: '-4px', padding: '20px'}}/>
				<Menu theme="dark" mode="inline" defaultSelectedKeys={['2']}>
					<Menu.Item key="1">
            <NavLink to="/profile">
              <Icon type="user" />
              <span>Profile</span>
            </NavLink>
					</Menu.Item>
					<Menu.Item key="2">
            <NavLink to="/">
              <Icon type="home" />
              <span>Home</span>
            </NavLink>
					</Menu.Item>
					<Menu.Item key="3">
            <NavLink to="/planner">
						<Icon type="calendar" />
						<span>Planner</span>
            </NavLink>
					</Menu.Item>
					<Menu.Item key="4">
            <NavLink to="/releases">
              <Icon type="tag" />
              <span>Releases</span>
            </NavLink>
					</Menu.Item>
					<Menu.Item key="5">
            <NavLink to="/services">
              <Icon type="tool" />
              <span>Services</span>
            </NavLink>
					</Menu.Item>
				</Menu>
			</Sider>
    );
  }
}

export default Nav;
