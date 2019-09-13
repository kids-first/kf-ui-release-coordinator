import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import {Button, Form, Message} from 'semantic-ui-react';
import {coordinatorApi} from '../globalConfig';

class NewServiceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      error: '',
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const values = e.target;

    let service = {
      name: values.name.value,
      description: values.description.value,
      author: this.props.user.name,
      url: values.url.value,
    };
    this.setState({loading: true});

    axios
      .post(`${coordinatorApi}/task-services`, service)
      .then(resp => {
        this.props.history.push(`/services/${resp.data.kf_id}`);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
          error: JSON.stringify(err.response.data),
        });
      });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Service Name</label>
            <input type="text" name="name" placeholder="My Service" />
          </Form.Field>
          <Form.Field>
            <label>Service Endpoint</label>
            <input type="text" name="url" placeholder="http://myservice" />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label>Description</label>
          <input type="text" name="description" />
        </Form.Field>
        {this.state.error && <Message negative content={this.state.error} />}
        <Button
          color="primary"
          loading={this.state.loading}
          type="submit"
          floated="right"
        >
          Register
        </Button>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(withRouter(NewServiceForm));
