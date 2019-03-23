import React, {Component} from 'react';
import axios from 'axios';
import {Divider, Icon, Row, Col, Spin, Tag, Steps} from 'antd';
import {Card} from 'kf-uikit';
import {coordinatorApi} from '../globalConfig';

const {Step} = Steps;

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
        <Spin tip="loading...">
          <Card style={{height: 300}} />
        </Spin>
      );
    }

    const releases = this.state.releases.map((release, i) => (
      <Step
        title={`${release.version} - ${release.kf_id} ${
          i === 0 ? '- latest' : ''
        }`}
        key={i}
        description={Date(release.created_at)}
      />
    ));

    return (
      <Card title="Study">
        <Row type="flex" justify="space-between">
          <Col>
            <h2>{this.state.study.name}</h2>
            <h3>
              <Tag>{this.state.study.kf_id}</Tag>
            </h3>
            <h3>
              <Icon type="tag" /> {this.state.study.version}
            </h3>
          </Col>
        </Row>

        <Divider style={{margin: 0, marginBottom: '24px'}} />

        <Row justify="space-around" type="flex">
          <Col span={24}>
            <h2>Release Timeline</h2>
          </Col>
        </Row>
        <Row>
          <Steps
            direction="vertical"
            labelPlacement="vertical"
            size="small"
            progressDot={true}
          >
            {releases}
          </Steps>
        </Row>
      </Card>
    );
  }
}

export default Study;
