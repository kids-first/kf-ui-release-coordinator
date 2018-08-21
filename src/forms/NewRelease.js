import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Alert, Col, Input, Tag, Button, Form, Row, Select, Table } from 'antd';
import TimeAgo from 'react-timeago'
import { coordinatorApi } from '../globalConfig';
import { UserContext } from '../contexts';
import ServiceList from '../components/ServiceList';
const FormItem = Form.Item;
const Option = Select.Option;

class NewReleaseForm extends Component {

  constructor(props) {
    super(props);

    let options = [
      'Complete Release',
      'Ready for Publication',
      'Under Review',
      'Returned for Modifications',
      'For Immediate Release',
      'Redacted'
    ].map((el, i) => <Option key={i}>{el}</Option>);

    const columns = [{
        title: 'Id',
        dataIndex: 'kf_id',
        key: 'viewButton',
        render: id => <Tag size='small' icon='profile' type='primary'>{id}</Tag>,
        width: '10%'
    }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: time => {
          return (<div><TimeAgo date={time} /></div>)
        }
    }];

    this.state = {
      data: [],
      selectedRowKeys: [],
      loading: true,
      tags: [],
      options: options,
      error: '',
      columns: columns
		}
  }

  componentDidMount() {
    axios.get(`${coordinatorApi}/studies`)
      .then(resp => {
        let studies = resp.data.results.map((s, i) => ({
          key: s.kf_id,
          kf_id: s.kf_id,
          name: `${s.name}`,
          created_at: s.created_at
        }));

        this.setState({data: studies, loading: false, error: '', tags: []});
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let release = {
          name: values.title,
          description: values.description,
          studies: this.state.selectedRowKeys,
          tags: this.state.tags.map(tag => tag.label),
          author: this.props.user.name
        };
        const token = this.props.egoToken;
        const header = {headers: {Authorization: 'Bearer '+token}};

        this.setState({loading: true});
        axios.post(`${coordinatorApi}/releases`, release, header)
          .then(resp => {
            this.props.history.push(`/releases/${resp.data.kf_id}`);
          })
          .catch( err => {
            console.log(err);
            this.setState({loading: false, error: JSON.stringify(err.response.data)});
          });
      }
    });
  }

	filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  }
  
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={8} type='flex' justify='space-around'>
          <Col span={24}>
            <FormItem label="Release Title">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please provide a title!' }],
              })(
                <Input placeholder="Title" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem label="Release Notes">
              {getFieldDecorator('description', {
                rules: [{ required: false, message: 'Please provide a title!' }],
              })(
                <Input.TextArea placeholder="Provide release notes here" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type='flex' justify='space-around'>
          <Col span={24}>
            <FormItem label="Studies">
              <Table
                title={() => 'Select Studies for Release'}
                loading={this.state.loading}
                columns={this.state.columns}
                dataSource={this.state.data}
                rowSelection={rowSelection} 
                size="small"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <h3>Services to be run for this release</h3>
          <ServiceList filters='enabled=True' noswitch/>
        </Row>
        {this.state.error && (
          <Alert type='error' message={this.state.error} />
        )}
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
      {user => <NewReleaseForm {...props}
        user={user.user} egoToken={user.egoToken}/>}
    </UserContext.Consumer>
  )
};

const WrappedNewReleaseForm = Form.create()(ReleaseProps);

export default withRouter(WrappedNewReleaseForm);
