import React, { Component } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import { Layout, Row, Col } from 'antd';
import { Header, Button } from 'kf-uikit';
import Login from '../views/Login';
import Status from '../views/Status';
import Planner from '../views/Planner';
import Release from '../views/Release';
import Releases from '../views/Releases';
import Studies from '../views/Studies';
import Study from '../views/Study';
import Services from '../views/Services';
import Service from '../views/Service';
import Profile from '../views/Profile';
import NewService from '../views/NewService';
import { UserContext } from '../contexts';
import { egoApi } from '../globalConfig';
const { Content } = Layout;

class Root extends Component {

  constructor(props) {
    super(props);

    this.onLogin = (token) => {
      this.setState({googleToken: token});
      axios.get(egoApi+'/oauth/google/token', { headers: { 'token': token }})
        .then(resp => {
          const jwtData = jwtDecode(resp.data);
          const user = {
            ...jwtData.context,
          };
          this.setState({ egoToken: resp.data, loggedIn: true, user: user.user });
        })
        .catch(err => {
          this.setState({ loggedIn: false });
          console.log(err);
        });
    };

    this.state = {
      loggedIn: false,
      onLogin: this.onLogin,
      user: {},
    };
  }

  render() {
    return (
      <Router>
        <UserContext.Provider value={this.state}>
        <div>
            { this.state.loggedIn ? (
            <Layout style={{minHeight:"100vh"}}> 
              <Header
                buttons={[
                  <NavLink to="/profile"><Button outline>Profile</Button></NavLink>,
                  <NavLink to="/"><Button outline>Status</Button></NavLink>,
                  <NavLink to="/planner"><Button outline>Planner</Button></NavLink>,
                  <NavLink to="/releases"><Button outline>Releases</Button></NavLink>,
                  <NavLink to="/studies"><Button outline>Studies</Button></NavLink>,
                  <NavLink to="/services"><Button outline>Services</Button></NavLink>,
                ]}
              />
              <Layout>
                <Content style={{ minHeight: '100%', margin: '16px 16px 0' }}>
                  <Route exact path="/" component={Status} />
                  <Route path="/planner" component={Planner} />
                  <Route exact path="/profile" component={Profile} />
                  <Route exact path="/releases" component={Releases} />
                  <Route exact path="/releases/:releaseId" component={Release} />
                  <Route exact path="/studies" component={Studies} />
                  <Route exact path="/studies/:studyId" component={Study} />
                  <Route exact path="/services" component={Services} />
                  <Route exact path="/service/new" component={NewService} />
                  <Route exact path="/services/:serviceId" component={Service} />
                </Content>
              </Layout>
            </Layout>
            ) : (
              <Login />
            )}
        </div>
        </UserContext.Provider>
      </Router>
    );
  }
}

export default Root;
