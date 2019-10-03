import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {useQuery} from '@apollo/react-hooks';
import {
  syncStudies,
  fetchAllStudies,
  toggleStudy,
  toggleAllStudies,
} from '../actions/studies';
import {Button, Icon, Loader, Message} from 'semantic-ui-react';
import StudiesTable from '../components/StudiesTable';

import {ALL_STUDIES} from '../queries';

const StudiesContainer = props => {
  const {
    loading: studiesLoading,
    error: studiesError,
    data: studiesData,
  } = useQuery(ALL_STUDIES);

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
        onClick={() => props.syncStudies()}
        disabled={props.syncing}
        primary
        icon
        labelPosition="left"
      >
        <Icon name="refresh" />
        Sync
      </Button>
      {props.syncMessage && props.syncMessage}
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
    syncStudies: () => dispatch(syncStudies()),
    fetchPage: (page, filters) => dispatch(fetchAllStudies(page, filters)),
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
    loading: state.studies.loading && state.studies.pages[1] === undefined,
    syncing: state.studies.syncing,
    syncMessage: state.studies.syncMessage,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StudiesContainer);
