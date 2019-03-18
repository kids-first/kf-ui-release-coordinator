import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchAllReleases} from '../actions';
import ReleaseList from '../components/ReleaseList';

class Releases extends Component {
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
        <ReleaseList
          loading={this.props.loading}
          releases={this.props.releases}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPage: (page, filters) => dispatch(fetchAllReleases(page, filters))
  };
}

function mapStateToProps(state) {
  return {
    pages: state.releases.pages,
    releases: Object.values(state.releases.items),
    loading: state.releases.loading && state.releases.pages[1] === undefined
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Releases);
