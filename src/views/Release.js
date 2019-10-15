import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {withRouter} from 'react-router-dom';
import {
  Accordion,
  Dimmer,
  Grid,
  Header,
  Image,
  Icon,
  Message,
  Segment,
  Label,
  Loader,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import Progress from '../components/Progress';
import TaskList from '../components/TaskList';
import Events from '../components/Events';
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
    <Segment basic>
      <Grid columns={3}>
        <Grid.Row centered>
          <Header as="h2">
            <Header.Content>{release.name}</Header.Content>
            <Header.Subheader>
              <TimeAgo date={new Date(release.createdAt)} />
            </Header.Subheader>
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3">Tags</Header>
            <Label basic>
              <Icon name="tag" />
              {release.version}
            </Label>
            <Label basic>
              <Icon name="tag" />
              {release.kfId}
            </Label>
          </Grid.Column>

          <Grid.Column textAlign="center">
            <Header as="h3">Authored By</Header>
            <Label basic>
              <Icon name="user" />
              {release.author}
            </Label>
          </Grid.Column>

          <Grid.Column textAlign="right">
            <Header as="h3">Studies in this Release</Header>
            <Accordion>
              <Accordion.Title active={true}>
                <Label>
                  <Icon name="eye" />
                  View all {release.studies.edges.length} studies
                  <Icon name="dropdown" />
                </Label>
              </Accordion.Title>
            </Accordion>
          </Grid.Column>
        </Grid.Row>
        {true && (
          <Grid.Row centered>
            <Label.Group>
              {release.studies.edges.map(({node}) => (
                <Label key={node.kfId} basic>
                  <Icon name="database" />
                  {node.kfId}
                </Label>
              ))}
            </Label.Group>
          </Grid.Row>
        )}

        <Grid.Row centered columns={1}>
          {release.state !== 'canceled' && release.state !== 'failed' ? (
            <Progress release={release} />
          ) : (
            <h2>
              <Icon kind="reset" /> {release.state}
            </h2>
          )}
        </Grid.Row>

        {release && (
          <Grid.Row centered>
            <ReleaseActions
              release={release}
              user={user}
              history={history}
              match={match}
            />
          </Grid.Row>
        )}

        {['staged', 'publishing', 'published', 'canceled', 'failed'].includes(
          release.state,
        ) && (
          <Grid.Row>
            <ReleaseReportSummary
              releaseId={release.kfId}
              releaseState={release.state}
            />
          </Grid.Row>
        )}

        <Grid.Row>
          <Header>Release Notes</Header>
        </Grid.Row>
        <Grid.Row>
          <MarkdownEditor
            type="release"
            releaseId={release.kfId}
            description={release.description}
          />
          {studyNotes}
        </Grid.Row>

        <Grid.Row>
          <Header>Release Timeline</Header>
        </Grid.Row>
        {events && (
          <Grid.Row>
            <ReleaseTimeline events={events.allEvents.edges} />
          </Grid.Row>
        )}
        <Grid.Row>
          <Grid.Column width="8">
            <Header>Task Status</Header>
            <TaskList releaseId={release.kfId} />
          </Grid.Column>
          <Grid.Column width="8">
            <Header>Event History</Header>
            <Events events={events && events.allEvents.edges} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
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
