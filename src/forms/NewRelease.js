import React, { Component } from 'react';
import { Input, Button, Form, Transfer } from 'antd';
const FormItem = Form.Item;

class NewReleaseForm extends Component {

  constructor(props) {
    super(props)

    let data = [];
    for (let i = 0; i < 20; i++) {
      const study = {
        key: i.toString(),
        title: `ST_${i + 1}`,
        description: `Seidman study ${i + 1}`,
        chosen: false
      };
      data.push(study);
    }

    this.state = {
      data: data,
			targetKeys: []
		}
    console.log(process.env.REACT_APP_DATASERVICE_API);
  }

  onComponentDidMount() {
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

	filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  }

	handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }

  renderItem = (item) => {
    const customLabel = (
      <span className="custom-item">
        {item.title} - {item.description}
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="Release Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please provide a title!' }],
          })(
            <Input placeholder="Title" />
          )}
        </FormItem>
        <FormItem label="Release Notes">
          {getFieldDecorator('description', {
            rules: [{ required: false, message: 'Please provide a title!' }],
          })(
            <Input.TextArea placeholder="Provide release notes here" />
          )}
        </FormItem>
        <FormItem label="Studies">
          <Transfer
						className='picker'
            dataSource={this.state.data}
            showSearch
            listStyle={{
              width: '45%',
              height: 300
            }}
            titles={['Available Studies', 'Studies Added to Release']}
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={this.renderItem}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Start Release 
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNewReleaseForm = Form.create()(NewReleaseForm);

export default WrappedNewReleaseForm;
