import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {withRouter, Link} from 'react-router-dom';
import {
  Button,
  Dimmer,
  Header,
  Image,
  Icon,
  Message,
  Segment,
  List,
  Loader,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import Progress from '../components/Progress';
import TaskList from '../components/TaskList';
import Events from '../components/Events';
import ReleaseHeader from '../components/ReleaseHeader';
import ReleaseTimeline from '../components/ReleaseTimeline';
import MarkdownEditor from '../components/MarkdownEditor';
import ReleaseActions from '../components/ReleaseActions';
import ReleaseReportSummary from '../components/ReleaseReportSummary';
import paragraph from '../paragraph.png';

import {GET_RELEASE, ALL_NOTES, ALL_EVENTS} from '../queries';

const Release = ({user, history, match}) => {
  const relayId = Buffer.from('ReleaseNode:' + match.params.releaseId).toString(
    'base64',
  );

  const {
    loading: releaseLoading,
    error: releaseError,
    data: releaseData,
  } = useQuery(GET_RELEASE, {variables: {id: relayId}, pollInterval: 5000});

  const {loading: eventsLoading, error: eventsError, data: events} = useQuery(
    ALL_EVENTS,
    {variables: {release: relayId}},
  );

  const {loading: notesLoading, error: notesError, data: notes} = useQuery(
    ALL_NOTES,
    {variables: {release: relayId}},
  );

  if (releaseError || eventsError || notesError)
    return (
      <Segment basic>
        <Message
          negative
          header="Error"
          content={releaseError + eventsError + notesError}
        />
      </Segment>
    );

  if (
    !releaseData ||
    releaseLoading ||
    !notes ||
    notesLoading ||
    !events ||
    eventsLoading
  )
    return (
      <Segment basic>
        <Dimmer active inverted>
          <Loader active inverted>
            Loading Release
          </Loader>
        </Dimmer>
        <Image src={paragraph} alt="loading" />
      </Segment>
    );

  let style = {
    marginTop: '24px',
    marginBottom: '24px',
  };

  const {release} = releaseData;

  if (!release) {
    return (
      <Segment placeholder basic>
        <Header icon>
          <Icon name="warning sign" />
          Release Not Found
        </Header>
        <Segment.Inline>
          <Button primary onClick={() => history.push('/releases')}>
            Back to Releases
          </Button>
        </Segment.Inline>
      </Segment>
    );
  }

  if (release.state === 'published') {
    style.backgroundColor = '#efffe8';
    style.padding = 20;
    style.marginTop = '4px';
    style.marginBottom = '4px';
  }

  if (release.state === 'canceled' || release.state === 'failed') {
    style.backgroundColor = '#f8a4a833';
    style.padding = 20;
    style.marginTop = '4px';
    style.marginBottom = '4px';
  }

  const notesByStudy = new Map();
  release.notes.edges.forEach(({node}) => {
    const key = node.study.slice(-11);
    const collection = notesByStudy.get(key);
    if (!collection) {
      notesByStudy.set(key, [node]);
    } else {
      collection.push(node);
    }
  });

  const studyNotes =
    notes &&
    notes.allNotes &&
    notes.allNotes.edges.length > 0 &&
    notes.allNotes.edges.map(({node}) => {
      return (
        <StudyNotes
          key={node.kfId}
          notes={notes}
          studyId={node.study.kfId}
          releaseId={release.kfId}
        />
      );
    });

  return (
    <>
      <ReleaseHeader release={release} loading={releaseLoading} />
      <Segment vertical>
        <Progress release={release} />
      </Segment>

      {release && (
        <Segment vertical textAlign="center">
          <ReleaseActions
            release={release}
            user={user}
            history={history}
            match={match}
          />
        </Segment>
      )}

      {['staged', 'publishing', 'published', 'canceled', 'failed'].includes(
        release.state,
      ) && (
        <Segment vertical>
          <ReleaseReportSummary
            releaseId={release.kfId}
            releaseState={release.state}
          />
        </Segment>
      )}

      <Segment vertical>
        <Header>Studies in this Release</Header>
        <List divided relaxed>
          {release.studies.edges.map(({node}) => (
            <List.Item key={node.kfId}>
              <List.Icon name="database" size="large" verticalAlign="middle" />
              <List.Content>
                <Link to={`/studies/${node.kfId}`}>{node.kfId}</Link> -{' '}
                {node.name}
                <List.Description>
                  Created <TimeAgo date={node.createdAt} />
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>

      <Segment vertical>
        <Header>Release Notes</Header>
        <MarkdownEditor
          type="release"
          releaseId={release.kfId}
          description={release.description}
        />
        {studyNotes}
      </Segment>

      <Segment vertical>
        <Header>Release Timeline</Header>
        {events && <ReleaseTimeline events={events.allEvents.edges} />}
      </Segment>
      <Segment vertical>
        <Header>Task Status</Header>
        <TaskList releaseId={release.kfId} />
      </Segment>
      <Segment vertical>
        <Header>Event History</Header>
        <Events events={events && events.allEvents.edges} />
      </Segment>
    </>
  );
};

/**
 * Grouping of notes for a single study
 **/
const StudyNotes = ({notes, studyId, releaseId}) => {
  // If no notes, only offer option for a new note
  if (!notes) {
    return (
      <div>
        <hr />
        <h3>Notes for {studyId}</h3>
        <StudyNote
          type="release-note"
          studyId={studyId}
          releaseId={releaseId}
        />
      </div>
    );
  }
  const studyNotes = notes.map((note, i) => (
    <article key={i}>
      <em>
        Note by {note.author} <TimeAgo date={note.createdAt} />
      </em>
      <hr />
      <StudyNote
        key={i}
        type="release-note"
        author={note.author}
        createdAt={note.createdAt}
        studyId={note.studyId}
        releaseId={note.releaseId}
        description={note.description}
        noteId={note.kfId}
      />
    </article>
  ));

  return (
    <div>
      <hr />
      <h3>Notes for {studyId}</h3>
      {studyNotes}

      <StudyNote type="release-note" studyId={studyId} releaseId={releaseId} />
    </div>
  );
};

/**
 * A single study note
 **/
const StudyNote = ({releaseId, studyId, noteId, description}) => (
  <div>
    <MarkdownEditor
      type="release-note"
      releaseId={releaseId}
      studyId={studyId}
      noteId={noteId}
      description={description}
    />
  </div>
);

export default withRouter(Release);
