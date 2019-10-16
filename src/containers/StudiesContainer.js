import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Button, Icon, Loader, Message} from 'semantic-ui-react';
import StudiesTable from '../components/StudiesTable';

import {ALL_STUDIES} from '../queries';
import {SYNC_STUDIES} from '../mutations';

const StudiesContainer = props => {
  const [syncMessage, setSyncMessage] = useState();

  const {
    loading: studiesLoading,
    error: studiesError,
    data: studiesData,
  } = useQuery(ALL_STUDIES);

  const [
    syncStudies,
    {loading: syncStudiesLoading, error: syncStudiesError},
  ] = useMutation(SYNC_STUDIES);

  const isSelected = key => {
    return props.selected.includes(key);
  };

  if (studiesError) {
    return <Message negative header="Error" content={studiesError.message} />;
  }
  if (studiesLoading) {
    return (
      <Loader active inline="centered">
        Loading Studies
      </Loader>
    );
  }

  return (
    <>
      {!props.hideSync && (
        <Button
          onClick={() =>
            syncStudies().then(resp => {
              const created = resp.data.syncStudies.new.edges.length;
              const deleted = resp.data.syncStudies.deleted.edges.length;
              setSyncMessage(
                `${created} new studies found, ${deleted} studies deleted`,
              );
            })
          }
          disabled={syncStudiesLoading}
          primary
          icon
          labelPosition="left"
        >
          <Icon name="refresh" />
          Sync
        </Button>
      )}
      {syncStudiesError && (
        <Message negative content={syncStudiesError.message} />
      )}
      {syncMessage && (
        <Message info header="Studies Synchronized" content={syncMessage} />
      )}
      <StudiesTable
        selectType="checkbox"
        toggleSelection={props.toggleStudy}
        isSelected={key => isSelected(key)}
        studies={studiesData ? studiesData.allStudies.edges : []}
        selectable={props.selectable}
        defaultPageSize={props.defaultPageSize}
      />
    </>
  );
};

export default StudiesContainer;
