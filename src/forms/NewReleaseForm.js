import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {Control, Form, Errors} from 'react-redux-form';
import {Button} from 'kf-uikit';
import {coordinatorApi} from '../globalConfig';
import StudiesContainer from '../containers/StudiesContainer';
import ServiceList from '../components/ServiceList';

class NewReleaseForm extends Component {
  handleSubmit = e => {
    let release = {
      name: e.title,
      description: '',
      studies: e.studies,
      tags: [],
      is_major: e.isMajor === 'true',
      author: this.props.user.name,
    };

    let text = `You are about to begin a release for ${
      release.studies.length
    } studies:
${release.studies.join('\n')}
These studies will be staged for review. This will not affect any
public facing data until it is reviewed and published.`;
    if (window.confirm(text)) {
      axios
        .post(`${coordinatorApi}/releases`, release)
        .then(resp => {
          this.props.history.push(`/releases/${resp.data.kf_id}`);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    return (
      <Form model="releaseForm" onSubmit={val => this.handleSubmit(val)}>
        <label>Release Title:</label>
        <Control.text
          model="title"
          defaultValue=""
          validators={{
            required: val => val && val.length,
          }}
        />
        <Errors
          className="text-red"
          model="title"
          messages={{
            required: 'This field is required',
          }}
        />
        <label>Is this a major release:</label>
        <Control.select model="isMajor">
          <option value={false}>No</option>
          <option value={true}>Yes</option>
        </Control.select>
        <label>Select studies to be included in this release</label>
        <Errors
          className="text-red"
          model="studies"
          messages={{
            required: 'Select at least one study to release',
          }}
        />
        <Control.custom
          model="studies"
          component={StudiesContainer}
          selectable
          defaultPageSize={10}
          validators={{
            required: val => val.selected.items.length !== 0,
          }}
        />
        <label>Services to be run for this release:</label>
        <ServiceList />
        <Button type="submit">Start the Release</Button>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    studies: state.studies.items,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(NewReleaseForm));
