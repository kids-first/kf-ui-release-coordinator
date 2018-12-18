import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {
  Alert,
  Col,
  Input,
  Tag,
  Form,
  Row,
  Checkbox,
  Select,
  Table,
  Modal,
} from 'antd';
import {Button} from 'kf-uikit';
import TimeAgo from 'react-timeago';
import {compareSemVer} from '../utils';
import {coordinatorApi} from '../globalConfig';
import StudiesContainer from '../containers/StudiesContainer';
// State stuff
import {UserContext} from '../contexts';

import ServiceList from '../components/ServiceList';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class NewReleaseForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: '',
    };
  }

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
    const {getFieldDecorator} = this.props.form;
    const {selectedRowKeys} = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={8} type="flex" justify="space-around">
          <Col span={24}>
            <FormItem label="Release Title">
              {getFieldDecorator('title', {
                rules: [{required: true, message: 'Please provide a title!'}],
              })(<Input placeholder="Title" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem>
              <Alert
                message="Major releases involve all publicly released studies and data shape changes"
                type="warning"
                showIcon
              />
              {getFieldDecorator('isMajor', {
                valuePropName: 'isMajor',
                initialValue: false,
              })(<Checkbox>This is a major release</Checkbox>)}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <FormItem label="Studies">
              <StudiesContainer
                tableProps={{defaultPageSize: 10, selectable: true}}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <h3>Services to be run for this release</h3>
          <ServiceList noswitch />
        </Row>
        {this.state.error && <Alert type="error" message={this.state.error} />}
        <FormItem>
          <Button type="primary" loading={this.state.loading} htmlType="submit">
            Start Release
          </Button>
        </FormItem>
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

const WrappedNewReleaseForm = Form.create()(ReleaseProps);

export default withRouter(WrappedNewReleaseForm);
