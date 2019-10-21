import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import HeaderContainer from '../containers/HeaderContainer';
import Login from '../views/Login';
import Status from '../views/Status';
import Planner from '../views/Planner';
import Profile from '../views/Profile';
import Release from '../views/Release';
import Releases from '../views/Releases';
import Studies from '../views/Studies';
import Study from '../views/Study';
import Services from '../views/Services';
import Service from '../views/Service';
import NewService from '../views/NewService';
import Callback from '../views/Callback';
import Auth from '../Auth';
import {Container} from 'semantic-ui-react';
import AdminRoute from '../AdminRoute';

const auth = new Auth();

const Root = props => (
  <Router>
    <Fragment>
      <Route
        path="/"
        render={({location}) => {
          if (!/^\/login$/.test(location.pathname)) {
            return <HeaderContainer />;
          }
          return <Login auth={auth} location={location} />;
        }}
      />
      <Container>
        <Route
          exact
          path="/callback"
          render={props => {
            return <Callback {...{...props, auth}} />;
          }}
        />
        <AdminRoute exact path="/" component={Status} />
        <AdminRoute path="/profile" component={Profile} />
        <AdminRoute path="/planner" component={Planner} />
        <AdminRoute exact path="/releases" component={Releases} />
        <AdminRoute exact path="/releases/:releaseId" component={Release} />
        <AdminRoute exact path="/studies" component={Studies} />
        <AdminRoute exact path="/studies/:studyId" component={Study} />
        <AdminRoute exact path="/services" component={Services} />
        <AdminRoute exact path="/service/new" component={NewService} />
        <AdminRoute exact path="/services/:serviceId" component={Service} />
      </Container>
    </Fragment>
  </Router>
);

export default Root;
