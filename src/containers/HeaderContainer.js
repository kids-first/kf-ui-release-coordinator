import React, {Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import semver from 'semver';
import {Header} from '../components/Header';
import {Container, Label, Segment} from 'semantic-ui-react';
import {commitHash, lastVersion, syslevel} from '../globalConfig';

const HeaderContainer = ({...props}) => {
  const profile = {
    username: props.userName,
  };

  const colors = {
    local: 'orange',
    dev: 'yellow',
    qa: 'blue',
    prd: 'green',
  };

  const version =
    {
      prd: lastVersion,
      qa: semver.inc(lastVersion, 'minor') + ' (prerelease)',
      dev: semver.inc(lastVersion, 'minor') + ' (development)',
      local: semver.inc(lastVersion, 'minor') + ' (development)',
    }[syslevel] || lastVersion;

  return (
    <Fragment>
      <Header profile={profile} />
      <Segment vertical secondary basic style={{padding: '0.4em 1em'}}>
        <Container>
          <Label horizontal color={colors[syslevel] || 'red'}>
            {syslevel}
          </Label>
          Release Coordinator UI{' '}
          <a
            href={`https://github.com/kids-first/kf-ui-release-coordinator/releases/tag/${version}`}
          >
            {version}
          </a>{' '}
          @{' '}
          <a
            href={`https://github.com/kids-first/kf-ui-release-coordinator/commit/${commitHash}`}
          >
            {commitHash}
          </a>
        </Container>
      </Segment>
    </Fragment>
  );
};

export default withRouter(HeaderContainer);
