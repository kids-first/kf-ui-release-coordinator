import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchPageOfReleases} from '../actions';
import ReleaseList from '../components/ReleaseList';

class Releases extends Component {
  componentDidMount() {
    this.props.fetchPage(1, {});
  }

  componentWillUnmount() {}

  render() {
    return <ReleaseList releases={this.props.releases} />;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPage: (page, filters) => dispatch(fetchPageOfReleases(page, filters)),
  };
}

function mapStateToProps(state) {
  return {
    releases: state.releases.items.releases,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Releases);
