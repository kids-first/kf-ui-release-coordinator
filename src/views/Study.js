import React, {Component} from 'react';
import axios from 'axios';
import className from 'classnames';
import {Card} from 'kf-uikit';
import Tag from '../components/Tag';
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
      return <Card className="min-h-screen">Loading</Card>;
    }

    const releases = this.state.releases.map((release, i) => (
      <li
        key={i}
        className={className('p-2 border border-lightGrey', {
          'bg-lightGrey': i % 2,
        })}
      >
        <Tag>{release.version}</Tag>
        <Tag type="release">{release.kf_id}</Tag>
        <span className="pl-2 text-sm">at {Date(release.created_at)}</span>
      </li>
    ));

    return (
      <Card title={this.state.study.name}>
        <div className="w-full">
          <Tag type="study">{this.state.study.kf_id}</Tag>
          Latest Version:
          <Tag>{this.state.study.version}</Tag>
        </div>

        <hr />

        <h2>Release Timeline</h2>
        <ul className="min-w-full list-reset">{releases}</ul>
      </Card>
    );
  }
}

export default Study;
