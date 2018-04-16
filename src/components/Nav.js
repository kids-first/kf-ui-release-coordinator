import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content } = Layout;

class Nav extends Component {
  render() {
    return (
			<Sider trigger={null} width={300}>
				<img src='/kf_releasecoordinator.png' width='300px' style={{backgroundColor: '#fff', marginBottom: '-4px'}}/>
				<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
					<Menu.Item key="1">
            <NavLink to="/">
              <Icon type="heart" />
              <span>Status</span>
            </NavLink>
					</Menu.Item>
					<Menu.Item key="2">
            <NavLink to="/planner">
						<Icon type="calendar" />
						<span>Planner</span>
            </NavLink>
					</Menu.Item>
					<Menu.Item key="3">
            <NavLink to="/releases">
              <Icon type="tag" />
              <span>Releases</span>
            </NavLink>
					</Menu.Item>
					<Menu.Item key="4">
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
