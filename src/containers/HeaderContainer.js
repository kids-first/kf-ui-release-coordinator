import React, {Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {Header} from '../components/Header';
import {syslevel} from '../globalConfig';

const HeaderContainer = ({...props}) => {
  const profile = {
    username: props.userName,
  };
  return (
    <Fragment>
      <Header profile={profile} />
      {syslevel !== 'prd' && (
        <center>
          <h3
            style={{
              color: 'white',
              background: `${syslevel === 'qa' ? '#f2711c' : '#008080'}`,
            }}
          >
            FYI, you're currently in the <b>{syslevel}</b> environment. Anything
            you do here will not be made public!
          </h3>
        </center>
      )}
    </Fragment>
  );
};

export default withRouter(HeaderContainer);
