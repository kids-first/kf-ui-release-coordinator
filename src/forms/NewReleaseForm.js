import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {Modal} from 'antd';
import TimeAgo from 'react-timeago';
import {Control, Form, Errors} from 'react-redux-form';
import {Button} from 'kf-uikit';
import {coordinatorApi} from '../globalConfig';
import StudiesContainer from '../containers/StudiesContainer';
// State stuff
import {UserContext} from '../contexts';

import ServiceList from '../components/ServiceList';
const FormItem = Form.Item;
const confirm = Modal.confirm;

class NewReleaseForm extends Component {
  handleSubmit = e => {
    console.log('submitting!');
    console.log(e);

    let release = {
      name: e.title,
      description: '',
      studies: e.studies,
      tags: [],
      is_major: e.isMajor,
      author: this.props.user.name,
    };

    let studyByKfId = {};

    const list = (
      <ul>
        {release.studies.map(study => (
          <li key={study}>{this.props.studies[study].name}</li>
        ))}
      </ul>
    );
    let text = (
      <p>
        You are about to begin a release for {release.studies.length} studies:
        {list}
        These studies will be staged for review. This <b>will not</b> affect any
        public facing data until it is reviewed and published.
      </p>
    );
    confirm({
      title: 'Submit release for processing',
      content: text,
      width: '80%',
      okText: "Let's do it",
      cancelText: 'Wait!',
      onOk: close => {
        const token = this.props.egoToken;
        const header = {headers: {Authorization: 'Bearer ' + token}};
        axios
          .post(`${coordinatorApi}/releases`, release, header)
          .then(resp => {
            this.props.history.push(`/releases/${resp.data.kf_id}`);
            close();
          })
          .catch(err => {
            console.log(err);
            this.setState({
              loading: false,
              error: JSON.stringify(err.response.data),
            });
            close();
          });
      },
      onCancel(close) {
        close();
      },
    });
  };

  render() {
    return (
      <Form model="releaseForm" onSubmit={val => this.handleSubmit(val)}>
        <label>Release Title:</label>
        <Control.text
          model=".title"
          defaultValue="Title"
          validators={{
            required: val => val && val.length,
          }}
        />
        <Errors
          className="text-red"
          model=".title"
          messages={{
            required: 'This field is required',
          }}
        />
        <label>Is this a major release:</label>
        <Control.checkbox model=".isMajor" /> Yes
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
    studies: state.studies.items,
  };
}

function ReleaseProps(props) {
  return (
    <UserContext.Consumer>
      {user => (
        <NewReleaseForm {...props} user={user.user} egoToken={user.egoToken} />
      )}
    </UserContext.Consumer>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ReleaseProps));
