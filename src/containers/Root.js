import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import HeaderContainer from '../containers/HeaderContainer';
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
import Callback from '../views/Callback';
import Auth from '../Auth';

const auth = new Auth();

const Root = props => (
  <Router>
    {props.userStatus === 'Approved' &&
    props.tokenExpires > Math.floor(new Date().getTime() / 1000) ? (
      <center className="bg-lightGrey">
        <HeaderContainer />
        <div className="min-h-full max-w-3xl m-0 px-4 text-left">
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
        </div>
      </center>
    ) : (
      <div>
        <Login path="/" auth={auth} />
        <Route
          path="/callback"
          render={props => {
            return <Callback {...{...props, auth}} />;
          }}
        />
      </div>
    )}
  </Router>
);

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${state.auth.token}`;
  return {
    userStatus: state.auth.user.status,
    tokenExpires: state.auth.tokenExpires,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Root);
