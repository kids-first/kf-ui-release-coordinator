import React, {Component} from 'react';
import axios from 'axios';
import {
  Segment,
  Card,
  Feed,
  Header,
  Icon,
  Label,
  Loader,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {coordinatorApi} from '../globalConfig';

class Study extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      study: {},
      releases: [],
      updating: false,
      toggling: false,
    };
  }

  componentWillMount() {
    axios
      .all([
        axios.get(
          `${coordinatorApi}/studies/${
            this.props.match.params.studyId
          }/releases`,
        ),
        axios.get(
          `${coordinatorApi}/studies/${this.props.match.params.studyId}`,
        ),
      ])
      .then(
        axios.spread((releases, study) => {
          this.setState({
            study: study.data,
            releases: releases.data.results,
            loading: false,
          });
        }),
      )
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.loading) {
      return (
        <Loader active inline="centered">
          Loading study timeline...
        </Loader>
      );
    }

    const releases = this.state.releases.map((release, i) => (
      <Feed.Event>
        <Feed.Label>
          <Icon name="tag" circular />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <Feed.User>{release.author}</Feed.User> created release '
            {release.name}'
            <Feed.Date>
              <TimeAgo date={new Date(release.created_at)} />
            </Feed.Date>
          </Feed.Summary>
          <Feed.Meta>
            <Label color="orange" size="tiny">
              <Icon name="tag" />
              {release.version}
            </Label>
            <Label color="orange" size="tiny">
              <Icon name="tag" />
              {release.kf_id}
            </Label>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    ));

    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Header as="h2">{this.state.study.name}</Header>
            <Label color="pink">
              <Icon name="database" />
              {this.state.study.kf_id}
            </Label>
            Latest Version:
            <Label color="orange">
              <Icon name="tag" />
              {this.state.study.version}
            </Label>
            <hr />
            <Header as="h2">Release Timeline</Header>
            <Feed>{releases}</Feed>
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

export default Study;
