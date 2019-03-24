import React from 'react';
import Steps, {Step} from './Steps';

const Progress = (props) => (
  <Steps current={props.release.state}>
    <Step
      title="pending"
      description="Waiting for confirmation from all task services"
    />
    <Step title="running" description="Tasks are running" />
    <Step
      title="staged"
      description={'Release is ready for preview \nand waiting for approval'}
    />
    <Step title="publishing" description="Release is being made public" />
    <Step
      title="published"
      description="Release has been completed and is available in the portal"
    />
  </Steps>
);

export default Progress;
