import React, {Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {useQuery} from '@apollo/react-hooks';
import {Header} from '../components/Header';
import {Container, Label, List, Segment} from 'semantic-ui-react';
import {commitHash, lastVersion, syslevel} from '../globalConfig';

import {STATUS} from '../queries';

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

  const version = lastVersion;

  const {
    loading: statusLoading,
    error: statusError,
    data: statusData,
  } = useQuery(STATUS);

  const status = statusData && statusData.status;

  return (
    <Fragment>
      <Header profile={profile} />
      <Segment vertical secondary basic style={{padding: '0.4em 1em'}}>
        <Container>
          <List horizontal>
            <List.Item>
              <Label horizontal color={colors[syslevel] || 'red'}>
                {syslevel}
              </Label>
            </List.Item>
            <List.Item>
              Release Coordinator UI{' '}
              {version.split('-').length === 1 ? (
                <a
                  href={`https://github.com/kids-first/kf-ui-release-coordinator/releases/tag/${version}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {version}
                </a>
              ) : (
                <a
                  href={`https://github.com/kids-first/kf-ui-release-coordinator/commit/${commitHash}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {version}
                </a>
              )}
            </List.Item>
            {status && !statusLoading && !statusError && (
              <List.Item>
                Release Coordinator API{' '}
                {status.version.split('-').length === 1 ? (
                  <a
                    href={`https://github.com/kids-first/kf-api-release-coordinator/releases/tag/${
                      status.version
                    }`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {status.version}
                  </a>
                ) : (
                  <a
                    href={`https://github.com/kids-first/kf-api-release-coordinator/commit/${
                      status.commit
                    }`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {status.version}
                  </a>
                )}
              </List.Item>
            )}
          </List>
        </Container>
      </Segment>
    </Fragment>
  );
};

export default withRouter(HeaderContainer);
