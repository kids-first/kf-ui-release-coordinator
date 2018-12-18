import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Alert, Col, Input, Form, Row, Icon } from 'antd';
import { Button } from 'kf-uikit';
import { coordinatorApi } from '../globalConfig';
const FormItem = Form.Item;

class NewServiceForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      error: ''
		}
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let service = {
          name: values.name,
          description: values.description,
          author: this.props.user.name,
          url: values.url
        };
        this.setState({loading: true});

        axios.post(`${coordinatorApi}/task-services`, service)
          .then(resp => {
            this.props.history.push(`/services/${resp.data.kf_id}`);
          })
          .catch( err => {
            console.log(err);
            this.setState({loading: false, error: JSON.stringify(err.response.data)});
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={8} type='flex' justify='space-around'>
          <Col span={12}>
            <FormItem label="Service Name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please provide a name!' }],
              })(
                <Input placeholder="Name" />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Service endpoint">
              {getFieldDecorator('url', {
                rules: [{ required: true,
                          message: 'Please provide an endpoint url!' },
                        { pattern: '^https?://',
                          message: 'Must begin with http(s)://'}]
              })(
                <Input
                  addonAfter={<Icon type="link" />} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem label="Description">
              {getFieldDecorator('description', {
                rules: [{ required: false, message: 'Please provide a description!' }],
              })(
                <Input.TextArea placeholder="What does this task do?" />
              )}
            </FormItem>
          </Col>
        </Row>
        {this.state.error && (
          <Alert type='error' message={this.state.error} />
        )}
        <FormItem>
          <Button color="primary" loading={this.state.loading} type="submit">
            Register
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNewServiceForm = Form.create()(NewServiceForm);

export default withRouter(WrappedNewServiceForm);
