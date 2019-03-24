import React, {Fragment} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {Header, Button} from 'kf-uikit';
import {syslevel} from '../globalConfig';

const HeaderContainer = ({...props}) => {
  return (
    <Fragment>
      {syslevel !== 'prd' && (
        <center>
          <h3
            className={`m-0 text-white ${
              syslevel === 'qa' ? 'bg-orange' : 'bg-pink'
            }`}
          >
            FYI, you're currently in the <b>{syslevel}</b> environment. Anything
            you do here will not be made public!
          </h3>
        </center>
      )}
      <Header
        buttons={[
          <NavLink key="status" to="/">
            <Button outline>Status</Button>
          </NavLink>,
          <NavLink key="planner" to="/planner">
            <Button outline>Planner</Button>
          </NavLink>,
          <NavLink key="releases" to="/releases">
            <Button outline>Releases</Button>
          </NavLink>,
          <NavLink key="studies" to="/studies">
            <Button outline>Studies</Button>
          </NavLink>,
          <NavLink key="services" to="/services">
            <Button outline>Services</Button>
          </NavLink>,
          <NavLink key="profile" to="/profile">
            <Button outline color="secondary">
              {props.userName}
            </Button>
          </NavLink>,
        ]}
      />
    </Fragment>
  );
};

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return {userName: state.auth.user.name};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderContainer);
