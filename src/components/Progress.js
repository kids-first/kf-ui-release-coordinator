import React, { Component } from 'react';
import { Steps, Icon} from 'antd';
const { Step } = Steps;

class Progress extends Component {
  render() {
    return (
        <Steps direction='horizontal' status='process' current={0}>
          <Step title="pending"
            icon={<Icon type='loading'/>}
            description="Waiting for confirmation from all task services"
          />
          <Step title="running"
            description="Tasks are running"
          />
          <Step title="staged"
            description={"Release is ready for preview \nand waiting for approval"}
          />
          <Step title="publishing"
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
