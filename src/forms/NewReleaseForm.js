import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {Alert, Col, Tag, Row, Modal} from 'antd';
import TimeAgo from 'react-timeago';
import {Control, Form} from 'react-redux-form';
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
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err === null) {
        let release = {
          name: values.title,
          description: '',
          studies: this.state.selectedRowKeys,
          tags: this.state.tags.map(tag => tag.label),
          is_major: values.isMajor,
          author: this.props.user.name,
        };

        let studyByKfId = {};

        for (let i in this.state.data) {
          studyByKfId[this.state.data[i].kf_id] = this.state.data[i].name;
        }
        const list = (
          <ul>
            {release.studies.map(study => (
              <li>{studyByKfId[study]}</li>
            ))}
          </ul>
        );
        let text = (
          <p>
            You are about to begin a release for {release.studies.length}{' '}
            studies:
            {list}
            These studies will be staged for review. This <b>will not</b> affect
            any public facing data until it is reviewed and published.
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

            this.setState({loading: true});
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
      }
    });
  };

  render() {
    return (
      <Form model="release" onSubmit={val => this.handleSubmit(val)}>
        <label>Release Title:</label>
        <Control.text model=".title" />

        <label>Is this a major release:</label>
        <Control.checkbox model=".isMajor" /> Yes

        <label>Select studies to be included in this release</label>
        <StudiesContainer selectable />

        <label>Services to be run for this release:</label>
        <ServiceList />

        <Button htmlType="submit">Start the Release</Button>
      </Form>
    );
  }
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

export default withRouter(NewReleaseForm);
