import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchAllStudies} from '../actions/studies';
import StudiesTable from '../components/StudiesTable';

class StudiesContainer extends Component {
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

  render() {
    return (
      <div>
        <StudiesTable
          loading={this.props.loading}
          studies={this.props.studies}
          {...this.props.tableProps}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPage: (page, filters) => dispatch(fetchAllStudies(page, filters)),
  };
}

function mapStateToProps(state) {
  return {
    pages: state.studies.pages,
    studies: Object.values(state.studies.items),
    loading: state.studies.loading && state.studies.pages[1] === undefined,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StudiesContainer);
