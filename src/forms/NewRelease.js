import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Alert, Col, Input, Tag, Button, Form, Row, Icon,
  Checkbox, Select, Table } from 'antd';
import TimeAgo from 'react-timeago'
import { coordinatorApi } from '../globalConfig';
// Editor library
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw  } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// State stuff
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
        title: 'Latest Version',
        dataIndex: 'version',
        key: 'version',
        align: 'center',
        render: version => {
          return(
            <div>
              {version ? version : 'not released yet'}
            </div>
          )
        }
    }, {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'right',
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
      editorState: EditorState.createEmpty(),
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
          version: `${s.version}`,
          created_at: s.created_at
        }));

        this.setState({data: studies, loading: false, error: '', tags: []});
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const rawContentState = convertToRaw(this.state.editorState.getCurrentContent());
      const markdownNotes = draftToMarkdown(rawContentState);

      if (!err) {
        let release = {
          name: values.title,
          description: markdownNotes,
          studies: this.state.selectedRowKeys,
          tags: this.state.tags.map(tag => tag.label),
          is_major: values.isMajor,
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

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, editorState } = this.state;
    const editorStyle = {
        cursor: 'text',
        maxWidth: '100%',
        height: 'auto',
        minHeight: '128px',
        verticalAlign: 'bottom',
        transition: 'all .3s, height 0s',
        overflow: 'auto',
        resize: 'vertical',
    }
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
                <Editor
                  wrapperClassName="wrapper-class"
                  editorClassName="ant-input"
                  editorStyle={editorStyle}
                  editorState={editorState}
                  onEditorStateChange={this.onEditorStateChange}
                  toolbar={{
                    options: ['inline', 'blockType', 'list', 'link', 'emoji', 'image', 'history'],
                    inline: {
                      inDropdown: false,
                      options: ['bold', 'italic']
                    },
                    blockType: {
                      inDropdown: true,
                      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'Blockquote', 'Code'],
                    },
                    emoji: {
                      emojis: [
                        '😀','😋', '😦', '👍', '👎', '👌','👻', '🐛','🔥', '🎉', '🎊', '🎁',
                        '📦', '📊', '📈', '🔇', '🔈', '📅', '✅', '❎', '💯', '❤️'
                      ],
                    },
                  }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem>
              <Alert message='Major releases involve all publicly released studies and data shape changes'
                type='warning'
                showIcon />
              {getFieldDecorator('isMajor', {
                valuePropName: 'isMajor',
                initialValue: false,
              })(
                <Checkbox>This is a major release</Checkbox>
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
