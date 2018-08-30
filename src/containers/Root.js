import React, { Component } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { BrowserRouter as Router, Route} from "react-router-dom";
import { Layout, Row, Col } from 'antd';
import Nav from '../components/Nav';
import Login from '../views/Login';
import Status from '../views/Status';
import Planner from '../views/Planner';
import Release from '../views/Release';
import Releases from '../views/Releases';
import Studies from '../views/Studies';
import Services from '../views/Services';
import Service from '../views/Service';
import Profile from '../views/Profile';
import NewService from '../views/NewService';
import UserCard from '../components/UserCard';
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
          <Row justify='center' type='flex'>
            { this.state.loggedIn ? (
            <Layout style={{height:"100vh"}}> 
              <Nav />
              <Layout>
                <UserCard />
                <Content style={{ minHeight: '100%', margin: '24px 16px 0' }}>
                <Row justify='center' type='flex'>
                <Col xl={24} xxl={18}>
                  <Route exact path="/" component={Status} />
                  <Route path="/planner" component={Planner} />
                  <Route exact path="/profile" component={Profile} />
                  <Route exact path="/releases" component={Releases} />
                  <Route exact path="/releases/:releaseId" component={Release} />
                  <Route exact path="/studies" component={Studies} />
                  <Route exact path="/services" component={Services} />
                  <Route exact path="/service/new" component={NewService} />
                  <Route exact path="/services/:serviceId" component={Service} />
                </Col>
                </Row>
                </Content>
              </Layout>
            </Layout>
            ) : (
              <Login />
            )}
          </Row>
        </div>
        </UserContext.Provider>
      </Router>
    );
  }
}

export default Root;
