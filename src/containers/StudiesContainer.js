import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  syncStudies,
  fetchAllStudies,
  toggleStudy,
  toggleAllStudies,
} from '../actions/studies';
import {Button, Icon} from 'kf-uikit';
import StudiesTable from '../components/StudiesTable';

class StudiesContainer extends Component {
  constructor() {
    super();

    this.state = {
      selection: [],
    };
  }

  componentDidMount() {
    const currPage = this.props.pages.currentPage;
    if (
      currPage === undefined ||
      this.props.pages[currPage] === undefined ||
      this.props.pages[currPage].next !== null
    ) {
      this.props.fetchPage(1, {});
    }
  }

  isSelected(key) {
    return this.props.selected.includes(key);
  }

  render() {
    return (
      <Fragment>
        <Button
          onClick={() => this.props.syncStudies()}
          disabled={this.props.syncing}
          color="secondary"
          className="my-4">
          <Icon kind="reset" className="text-white" height={14} width={14} />
          Sync
        </Button>
        {this.props.syncMessage && this.props.syncMessage}
        <StudiesTable
          selectType="checkbox"
          toggleSelection={this.props.toggleStudy}
          toggleAll={this.props.toggleAll}
          selectAll={this.props.selectAll}
          isSelected={key => this.isSelected(key)}
          loading={this.props.loading}
          studies={this.props.studies}
          selectable={this.props.selectable}
          defaultPageSize={this.props.defaultPageSize}
        />
      </Fragment>
    );
  }
}

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
