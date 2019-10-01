import React, {useState} from 'react';
import axios from 'axios';
import {Button, Confirm, Grid, Icon, Label, Modal} from 'semantic-ui-react';
import {coordinatorApi, snapshotApi} from '../globalConfig';

const ReleaseActions = ({release, user, history, match}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    const curRelease = release;
    const newRelease = {
      name: curRelease.name,
      description: curRelease.description,
      studies: curRelease.studies,
      tags: curRelease.tags,
      is_major: curRelease.is_major,
      author: user.name,
    };

    axios
      .post(`${coordinatorApi}/releases`, newRelease)
      .then(resp => {
        history.push(`/releases/${resp.data.kf_id}`);
        setShowConfirm(!showConfirm);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const publish = () => {
    axios
      .post(`${coordinatorApi}/releases/${match.params.releaseId}/publish`, {})
      .then(resp => {
        console.log('published');
        // Remove this when graphql mutations are added
        window.location.reload();
      });
  };

  const cancel = () => {
    axios.delete(`${coordinatorApi}/releases/${release.kfId}`).then(resp => {
      console.log('canceled');
      // Remove this when graphql mutations are added
      window.location.reload();
    });
  };

  return (
    <Grid.Row centered>
      <Button.Group size="large">
        <Button
          icon
          negative
          labelPosition="left"
          onClick={cancel}
          loading={release.state === 'canceling'}
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
          disabled={release.state !== 'staged'}
        >
          Publish
          <Icon name="bookmark" />
        </Button>
      </Button.Group>
      <Confirm
        open={showConfirm}
        cancelButton="Cancel"
        confirmButton="Start New Release"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => this.handleConfirm()}
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
