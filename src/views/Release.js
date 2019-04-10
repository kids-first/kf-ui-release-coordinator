import React, {Component} from 'react';
import axios from 'axios';
import {Button, Card, Icon} from 'kf-uikit';
import TimeAgo from 'react-timeago';
import Tag from '../components/Tag';
import Progress from '../components/Progress';
import TaskList from '../components/TaskList';
import Events from '../components/Events';
import ReleaseTimeline from '../components/ReleaseTimeline';
import MarkdownEditor from '../components/MarkdownEditor';
import ReleaseReportSummary from '../components/ReleaseReportSummary';
import {coordinatorApi, snapshotApi} from '../globalConfig';

class Release extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      release: {},
      events: [],
      publishing: false,
      canceling: false,
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

  render() {
    if (this.state.loading) {
      return (
        <Card className="min-h-screen">
          <h1>Loading</h1>
        </Card>
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
      return (
        <StudyNotes
          key={i}
          notes={notes}
          studyId={study}
          releaseId={this.state.release.kf_id}
        />
      );
    });

    return (
      <Card
        title={`Release ${this.props.match.params.releaseId} - ${
          this.state.release.version
        } - ${this.state.release.name}`}
      >
        <Icon kind="comment" width={16} />
        <Tag>{this.state.release.version}</Tag>
        <Icon kind="comment" width={16} />
        <Tag type="release">{this.state.release.kf_id}</Tag>
        <h5 style={{margin: 0}}>
          <Icon type="resources" /> Created At:{' '}
          <em>{Date(this.state.release.created_at)}</em>
        </h5>
        <h5 style={{margin: 0}}>
          <Icon kind="user" /> Author: <em>{this.state.release.author}</em>
        </h5>
        <span>Studies in this Release:</span>
        <br />
        {this.state.release.studies.map((r, i) => (
          <Tag type="study" key={i}>
            {r}
          </Tag>
        ))}
        <hr />
        {this.state.release.state !== 'canceled' &&
        this.state.release.state !== 'failed' ? (
          <Progress release={this.state.release} />
        ) : (
          <h2>
            <Icon kind="reset" /> {this.state.release.state}
          </h2>
        )}
        <hr />
        {['staged', 'publishing', 'published', 'canceled', 'failed'].includes(
          this.state.release.state,
        ) && (
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
        <div className="flex justify-around w-full">
          <Button
            size="large"
            color="primary"
            onClick={() => this.publish()}
            disabled={disabled}
          >
            <Icon kind="add" />
            Publish
          </Button>
          <a href={`${snapshotApi}/download/${this.state.release.kf_id}`}>
            <Button size="large" color="primary" disabled={false}>
              <Icon kind="download" />
              Download Snapshot
            </Button>
          </a>
          <Button
            size="large"
            color="primary"
            onClick={() => this.cancel()}
            loading={this.state.canceling}
            disabled={
              this.state.release.state === 'published' ||
              this.state.release.state === 'publishing' ||
              this.state.release.state === 'canceled' ||
              this.state.release.state === 'failed'
            }
          >
            <Icon kind="close" />
            Cancel
          </Button>
        </div>
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
      </Card>
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
