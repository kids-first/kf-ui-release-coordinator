import React, {useState, Fragment} from 'react';
import {connect} from 'react-redux';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {
  toggleStudy,
  toggleAllStudies,
} from '../actions/studies';
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
    return <Message negative header="Error" content={studiesError} />;
  }
  if (studiesLoading) {
    return (
      <Loader active inline="centered">
        Loading Studies
      </Loader>
    );
  }

  return (
    <Fragment>
      <Button
        onClick={() =>
          syncStudies().then(resp => {
            console.log(resp);
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
      {syncStudiesError && (
        <Message negative content={syncStudiesError.message} />
      )}
      {syncMessage && (
        <Message info header="Studies Synchronized" content={syncMessage} />
      )}
      <StudiesTable
        selectType="checkbox"
        toggleSelection={props.toggleStudy}
        toggleAll={props.toggleAll}
        selectAll={props.selectAll}
        isSelected={key => isSelected(key)}
        studies={studiesData ? studiesData.allStudies.edges : []}
        selectable={props.selectable}
        defaultPageSize={props.defaultPageSize}
      />
    </Fragment>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    toggleStudy: studyId => dispatch(toggleStudy(studyId)),
    toggleAll: () => dispatch(toggleAllStudies()),
  };
}

function mapStateToProps(state) {
  return {
    pages: state.studies.pages,
    studies: Object.values(state.studies.items),
    selected: state.studies.selected.items,
    selectAll: state.studies.selected.selectAll,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StudiesContainer);
