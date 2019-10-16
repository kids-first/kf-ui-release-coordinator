import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {
  Segment,
  Feed,
  Header,
  Icon,
  Label,
  Loader,
  Message,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {GET_STUDY} from '../queries';

const Study = props => {
  const relayId = Buffer.from(
    'StudyNode:' + props.match.params.studyId,
  ).toString('base64');

  const {loading: studyLoading, error: studyError, data: studyData} = useQuery(
    GET_STUDY,
    {variables: {id: relayId}},
  );

  if (studyLoading || !studyData) {
    return (
      <Loader active inline="centered">
        Loading study timeline...
      </Loader>
    );
  }

  if (studyError) {
    return <Message negative header="Error" content={studyError} />;
  }
  const {study} = studyData;

  const releases = study.releases ? (
    study.releases.edges.map(({node}, i) => (
      <Feed.Event key={i}>
        <Feed.Label>
          <Icon name="tag" circular />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <Feed.User>{node.author}</Feed.User> created release '{node.name}'
            <Feed.Date>
              <TimeAgo date={new Date(node.createdAt)} />
            </Feed.Date>
          </Feed.Summary>
          <Feed.Meta>
            <Label color="orange" size="tiny">
              <Icon name="tag" />
              {node.version}
            </Label>
            <Label color="orange" size="tiny">
              <Icon name="tag" />
              {node.kfId}
            </Label>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    ))
  ) : (
    <div>No Releases yet</div>
  );

  return (
    <>
      <Segment basic secondary>
        <Header as="h2">{study.name}</Header>
        <Label basic>
          <Icon name="database" />
          {study.kfId}
        </Label>
        Latest Version:
        {!study.releases.edges ? (
          <Label color="orange">
            <Icon name="tag" />
            {study.releases.edges[0].node.version}
          </Label>
        ) : (
          <span> No releases yet</span>
        )}
      </Segment>
      <Segment vertical>
        <Header as="h2">Release Timeline</Header>
        <Feed>{releases}</Feed>
      </Segment>
    </>
  );
};

export default Study;
