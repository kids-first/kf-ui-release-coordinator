import React, { Component } from 'react';
import axios from 'axios';
import { Steps, Icon} from 'antd';
const { Step } = Steps;

class Progress extends Component {

  constructor(props) {
    super(props);
  }

  isLoading(desired) {
    if (this.props.release.state == desired) {
      return <Icon type='loading'/>
    }
  }

  render() {
    var current = -1;

    if (this.props.release.state == 'pending') {
      current = 0;
    } else if (this.props.release.state == 'running') {
      current = 1;
    } else if (this.props.release.state == 'staged') {
      current = 2;
    } else if (this.props.release.state == 'publishing') {
      current = 3;
    } else if (this.props.release.state == 'published') {
      current = 5;
    }

    var s = '';
    if (current == 1 || current == 2) {
      s = 'process';
    } else {
      s = 'wait';
    }

    return (
      <Steps direction='horizontal' status={s} current={current}>
        <Step title="pending"
          icon={this.isLoading('pending')}
          description="Waiting for confirmation from all task services"
        />
        <Step title="running"
          icon={this.isLoading('running')}
          description="Tasks are running"
        />
        <Step title="staged"
          description={"Release is ready for preview \nand waiting for approval"}
        />
        <Step title="publishing"
          icon={this.isLoading('publishing')}
          description="Release is being made public"
        />
        <Step title="published"
          description="Release has been completed and is available in the portal"
        />
      </Steps>
    );
  }
}

export default Progress;
