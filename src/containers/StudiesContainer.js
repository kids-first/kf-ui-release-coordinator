import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  fetchAllStudies,
  toggleStudy,
  toggleAllStudies,
} from '../actions/studies';
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
      <StudiesTable
        selectType="checkbox"
        toggleSelection={this.props.toggleStudy}
        toggleAll={this.props.toggleAll}
        selectAll={this.props.selectAll}
        isSelected={key => this.isSelected(key)}
        loading={this.props.loading}
        studies={this.props.studies}
        {...this.props.tableProps}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StudiesContainer);
