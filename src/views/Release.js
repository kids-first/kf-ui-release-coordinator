import React, {Component} from 'react';
import axios from 'axios';
import {
  Accordion,
  Button,
  Card,
  Dimmer,
  Grid,
  Header,
  Image,
  Icon,
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
import ReleaseReportSummary from '../components/ReleaseReportSummary';
import {coordinatorApi, snapshotApi} from '../globalConfig';
import paragraph from '../paragraph.png';

class Release extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      release: {},
      events: [],
      publishing: false,
      canceling: false,
      showStudies: false,
    };
    this.getData();
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.getData();
    this.timer = setTimeout(() => this.getData(), 3000);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
  }

  publish() {
    let release = this.state.release;
    release.state = 'publishing';
    this.setState({publishing: true});
    axios
      .post(
        `${coordinatorApi}/releases/${
          this.props.match.params.releaseId
        }/publish`,
        {},
      )
      .then(resp => {
        this.setState({publishing: false});
        this.timer = setTimeout(() => this.getData(), 3000);
      });
  }

  cancel() {
    let release = this.state.release;
    release.state = 'canceling';
    this.setState({canceling: true});
    axios
      .delete(`${coordinatorApi}/releases/${this.props.match.params.releaseId}`)
      .then(resp => {
        this.setState({canceling: false});
        this.getData();
      });
  }

  getData() {
    if (
      !this.mounted ||
      this.state.release.state === 'staged' ||
      this.state.release.state === 'canceled' ||
      this.state.release.state === 'published'
    ) {
      return;
    }
    axios
      .all([
        axios.get(
          `${coordinatorApi}/releases/${this.props.match.params.releaseId}`,
        ),
        axios.get(
          `${coordinatorApi}/events?release=${
            this.props.match.params.releaseId
          }`,
        ),
      ])
      .then(
        axios.spread((release, events) => {
          this.setState({
            release: release.data,
            events: events.data.results.reverse(),
            loading: false,
          });
          this.timer = setTimeout(() => this.getData(), 3000);
        }),
      )
      .catch(error => console.log(error));
  }

  toggleStudies() {
    this.setState({showStudies: !this.state.showStudies});
  }

  render() {
    if (this.state.loading) {
      return (
        <Segment basic>
          <Card fluid>
            <Card.Content>
              <Dimmer active inverted>
                <Loader active inverted>
                  Loading Release
                </Loader>
              </Dimmer>
              <Image src={paragraph} alt="loading" />
            </Card.Content>
          </Card>
        </Segment>
      );
    }

    let disabled =
      this.state.publishing || this.state.release.state !== 'staged'
        ? true
        : false;

    let style = {
      marginTop: '24px',
      marginBottom: '24px',
    };

    if (this.state.release.state === 'published') {
      style.backgroundColor = '#efffe8';
      style.padding = 20;
      style.marginTop = '4px';
      style.marginBottom = '4px';
    }

    if (
      this.state.release.state === 'canceled' ||
      this.state.release.state === 'failed'
    ) {
      style.backgroundColor = '#f8a4a833';
      style.padding = 20;
      style.marginTop = '4px';
      style.marginBottom = '4px';
    }

    const notesByStudy = new Map();
    this.state.release.notes.forEach(note => {
      const key = note.study.slice(-11);
      const collection = notesByStudy.get(key);
      if (!collection) {
        notesByStudy.set(key, [note]);
      } else {
        collection.push(note);
      }
    });

    const notes = this.state.release.studies.map((study, i) => {
      const notes = notesByStudy.get(study);
      if (notes) {
        return (
          <StudyNotes
            key={i}
            notes={notes}
            studyId={study}
            releaseId={this.state.release.kf_id}
          />
        );
      }
      return;
    });

    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Grid columns={3}>
              <Grid.Row centered>
                <Header as="h2">
                  <Header.Content>{this.state.release.name}</Header.Content>
                  <Header.Subheader>
                    <TimeAgo date={new Date(this.state.release.created_at)} />
                  </Header.Subheader>
                </Header>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h3">Tags</Header>
                  <Label color="orange">
                    <Icon name="tag" />
                    {this.state.release.version}
                  </Label>
                  <Label color="orange">
                    <Icon name="tag" />
                    {this.state.release.kf_id}
                  </Label>
                </Grid.Column>

                <Grid.Column textAlign="center">
                  <Header as="h3">Authored By</Header>
                  <Label color="blue">
                    <Icon name="user" />
                    {this.state.release.author}
                  </Label>
                </Grid.Column>

                <Grid.Column textAlign="right">
                  <Header as="h3">Studies in this Release</Header>
                  <Accordion>
                    <Accordion.Title active={this.state.showStudies}>
                      <Label onClick={() => this.toggleStudies()}>
                        <Icon name="eye" />
                        View all {this.state.release.studies.length} studies
                        <Icon name="dropdown" />
                      </Label>
                    </Accordion.Title>
                  </Accordion>
                </Grid.Column>
              </Grid.Row>
              {this.state.showStudies && (
                <Grid.Row centered>
                  <Label.Group>
                    {this.state.release.studies.map((r, i) => (
                      <Label color="pink">
                        <Icon name="database" key={i} />
                        {r}
                      </Label>
                    ))}
                  </Label.Group>
                </Grid.Row>
              )}
              <Grid.Row centered columns={1}>
                {this.state.release.state !== 'canceled' &&
                this.state.release.state !== 'failed' ? (
                  <Progress release={this.state.release} />
                ) : (
                  <h2>
                    <Icon kind="reset" /> {this.state.release.state}
                  </h2>
                )}
              </Grid.Row>
              <Grid.Row centered>
                <Button.Group size="large">
                  <Button
                    icon
                    negative
                    labelPosition="left"
                    onClick={() => this.cancel()}
                    loading={this.state.canceling}
                    disabled={
                      this.state.release.state === 'published' ||
                      this.state.release.state === 'publishing' ||
                      this.state.release.state === 'canceled' ||
                      this.state.release.state === 'failed'
                    }
                  >
                    <Icon name="cancel" />
                    Cancel
                  </Button>
                  <Button
                    as="a"
                    href={`${snapshotApi}/download/${this.state.release.kf_id}`}
                  >
                    <Icon name="download" />
                    Download Snapshot
                  </Button>
                  <Button
                    icon
                    positive
                    labelPosition="right"
                    onClick={() => this.publish()}
                    disabled={disabled}
                  >
                    Publish
                    <Icon name="bookmark" />
                  </Button>
                </Button.Group>
              </Grid.Row>
            </Grid>
            <hr />
            {[
              'staged',
              'publishing',
              'published',
              'canceled',
              'failed',
            ].includes(this.state.release.state) && (
              <ReleaseReportSummary
                releaseId={this.state.release.kf_id}
                releaseState={this.state.release.state}
              />
            )}
            <hr />
            <h1>Release Notes</h1>
            <MarkdownEditor
              type="release"
              releaseId={this.state.release.kf_id}
              description={this.state.release.description}
            />
            {notes}
            <hr />
            <div>
              <center>
                <h3>Release Timeline</h3>
              </center>
              <ReleaseTimeline
                releaseId={this.state.release.kf_id}
                releaseState={this.state.release.state}
              />
            </div>
            <hr />
            <hr />
            <div className="flex w-full">
              <div className="w-1/2">
                <h2>
                  Task Status <span />
                </h2>
                <TaskList releaseId={this.state.release.kf_id} />
              </div>
              <div className="w-1/2">
                <h2>
                  Event History <span />
                </h2>
                <Events events={this.state.events} />
              </div>
            </div>
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

/**
 * Grouping of notes for a single study
 **/
class StudyNotes extends Component {
  render() {
    // If no notes, only offer option for a new note
    if (!this.props.notes) {
      return (
        <div>
          <hr className="p-0" />
          <h3 className="m-0">Notes for {this.props.studyId}</h3>
          <StudyNote
            type="release-note"
            studyId={this.props.studyId}
            releaseId={this.props.releaseId}
          />
        </div>
      );
    }
    const notes = this.props.notes.map((note, i) => (
      <article>
        <em>
          Note by {note.author} <TimeAgo date={note.created_at} />
        </em>
        <hr />
        <StudyNote
          key={i}
          type="release-note"
          author={note.author}
          createdAt={note.created_at}
          studyId={note.study_id}
          releaseId={note.release_id}
          description={note.description}
          noteId={note.kf_id}
        />
      </article>
    ));

    return (
      <div>
        <hr className="p-0" />
        <h3 className="m-0">Notes for {this.props.studyId}</h3>
        {notes}

        <StudyNote
          type="release-note"
          studyId={this.props.studyId}
          releaseId={this.props.releaseId}
        />
      </div>
    );
  }
}

/**
 * A single study note
 **/
class StudyNote extends Component {
  render() {
    return (
      <div>
        <MarkdownEditor
          type="release-note"
          releaseId={this.props.releaseId}
          studyId={this.props.studyId}
          noteId={this.props.noteId}
          description={this.props.description}
        />
      </div>
    );
  }
}

export default Release;
