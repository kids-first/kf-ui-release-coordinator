import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Alert, Col, Input, Button, Form, Row, Select, Transfer } from 'antd';
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

    this.state = {
      data: [],
			targetKeys: [],
      loading: true,
      tags: [],
      options: options,
      error: ''
		}
  }

  componentDidMount() {
    let api = process.env.REACT_APP_DATASERVICE_API;
    axios.get(`${api}/studies?limit=100`)
      .then(resp => {
        let studies = resp.data.results.map((s, i) => ({
          key: s.kf_id,
          title: s.kf_id,
          description: `${s.name}`,
          chosen: false
        }));
        this.setState({data: studies, loading: false, error: '', tags: []});
      });
  }

  handleSubmit = (e) => {
    let api = process.env.REACT_APP_COORDINATOR_API;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let release = {
          name: values.title,
          description: values.description,
          studies: this.state.targetKeys,
          tags: this.state.tags.map(tag => tag.label)
        };
        this.setState({loading: true});
        axios.post(`${api}/releases`, release)
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

	handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }
  
	handleTags = (tags) => {
    this.setState({ tags: tags });
  }

  renderItem = (item) => {
    const customLabel = (
      <span>
        {item.title} - {item.description}
      </span>
    );

    return {
      label: customLabel,
      value: item.title,
    };
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={8} type='flex' justify='space-around'>
          <Col span={12}>
            <FormItem label="Release Title">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please provide a title!' }],
              })(
                <Input placeholder="Title" />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='Tags'>
              <Select
                classname='select'
                mode="tags"
                placeholder="tags"
                defaultValue={[]}
                onChange={this.handleTags}
                labelInValue
              >
              {this.state.options}
              </Select>
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
              <Transfer
                className='picker'
                dataSource={this.state.data}
                showSearch
                listStyle={{
                  width: '45%',
                  height: 300
                }}
                notFoundContent='No studies added to the release yet'
                titles={['Available Studies', 'Studies Added to Release']}
                filterOption={this.filterOption}
                targetKeys={this.state.targetKeys}
                onChange={this.handleChange}
                render={this.renderItem}
              />
            </FormItem>
          </Col>
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

const WrappedNewReleaseForm = Form.create()(NewReleaseForm);

export default withRouter(WrappedNewReleaseForm);
