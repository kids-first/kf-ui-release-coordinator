import React, {useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {
  Button,
  Confirm,
  Grid,
  Icon,
  Label,
  Message,
  Modal,
} from 'semantic-ui-react';
import {snapshotApi} from '../globalConfig';

import {START_RELEASE, PUBLISH_RELEASE, CANCEL_RELEASE} from '../mutations';

const ReleaseActions = ({release, user, history, match}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const [
    startRelease,
    {loading: startReleaseLoading, error: startReleaseError},
  ] = useMutation(START_RELEASE);

  const [
    publishRelease,
    {loading: publishReleaseLoading, error: publishReleaseError},
  ] = useMutation(PUBLISH_RELEASE);

  const [
    cancelRelease,
    {loading: cancelReleaseLoading, error: cancelReleaseError},
  ] = useMutation(CANCEL_RELEASE);

  const handleConfirm = () => {
    const curRelease = release;
    const newRelease = {
      name: curRelease.name,
      description: curRelease.description,
      studies: curRelease.studies.edges.map(({node}) => node.id),
      tags: curRelease.tags,
      isMajor: curRelease.isMajor,
    };

    startRelease({variables: {input: newRelease}})
      .then(resp => {
        history.push(`/releases/${resp.data.startRelease.release.kfId}`);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const publish = () => {
    publishRelease({variables: {release: release.id}});
  };

  const cancel = () => {
    cancelRelease({variables: {release: release.id}});
  };

  return (
    <Grid.Row centered>
      {(startReleaseError || publishReleaseError || cancelReleaseError) && (
        <Message
          negative
          header="Error"
          content={startReleaseError + publishReleaseError + cancelReleaseError}
        />
      )}
      <Button.Group size="large">
        <Button
          icon
          negative
          labelPosition="left"
          onClick={cancel}
          loading={release.state === 'canceling' || cancelReleaseLoading}
          disabled={
            release.state === 'published' ||
            release.state === 'publishing' ||
            release.state === 'canceled' ||
            release.state === 'failed'
          }
        >
          <Icon name="cancel" />
          Cancel
        </Button>
        <Button as="a" href={`${snapshotApi}/download/${release.kf_id}`}>
          <Icon name="download" />
          Download Snapshot
        </Button>
        <Button
          icon
          labelPosition="right"
          onClick={() => setShowConfirm(!showConfirm)}
        >
          Run Again
          <Icon name="repeat" />
        </Button>
        <Button
          icon
          positive
          labelPosition="right"
          onClick={publish}
          loading={publishReleaseLoading}
          disabled={release.state !== 'staged'}
        >
          Publish
          <Icon name="bookmark" />
        </Button>
      </Button.Group>
      <Confirm
        open={showConfirm}
        cancelButton="Cancel"
        confirmButton={
          <Button loading={startReleaseLoading}>Start New Release</Button>
        }
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        header={`Restart release: '${release.name}'`}
        content={
          <Modal.Content>
            <p>
              You are about to start a new release identical to this release. It
              will be assigned a new release id an version number but will be
              identical otherwise.
            </p>
            {release.studies && (
              <Label.Group>
                {release.studies.edges.map(({node}) => (
                  <Label basic key={node.kfId}>
                    <Icon name="database" />
                    {node.kfId}
                  </Label>
                ))}
              </Label.Group>
            )}
          </Modal.Content>
        }
      />
    </Grid.Row>
  );
};

export default ReleaseActions;
