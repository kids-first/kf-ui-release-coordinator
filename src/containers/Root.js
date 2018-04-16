import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import { Layout, Row } from 'antd';
import Nav from '../components/Nav';
import Status from '../views/Status';
import Planner from '../views/Planner';
import Release from '../views/Release';
import Releases from '../views/Releases';
import Services from '../views/Services';
import Service from '../views/Service';
import NewService from '../views/NewService';
const { Content } = Layout;

class Root extends Component {
  render() {
    return (
      <Router>
        <div>
          <Row justify='center' type='flex'>
            <Layout style={{height:"100vh"}}> 
              <Nav />
              <Layout>
                <Content style={{ minHeight: '100%', margin: '24px 16px 0' }}>
                  <Route exact path="/" component={Status} />
                  <Route path="/planner" component={Planner} />
                  <Route exact path="/releases" component={Releases} />
                  <Route exact path="/releases/:releaseId" component={Release} />
                  <Route exact path="/services" component={Services} />
                  <Route exact path="/service/new" component={NewService} />
                  <Route exact path="/services/:serviceId" component={Service} />
                </Content>
              </Layout>
            </Layout>
          </Row>
        </div>
      </Router>
    );
  }
}

export default Root;
