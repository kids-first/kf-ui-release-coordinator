import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import {Button} from 'semantic-ui-react';
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
      <form onSubmit={this.handleSubmit}>
        <label>
          Service Name
          <input type="text" name="name" />
        </label>
        <label>
          Service Endpoint
          <input type="text" name="url" />
        </label>
        <label>
          Description
          <input type="text" name="description" />
        </label>
        {this.state.error && (
          <div className="w-full my-2 p-2 bg-lightGrey">
            <h4 className="m-0">Error :(</h4> <p>{this.state.error}</p>
          </div>
        )}
        <Button color="primary" loading={this.state.loading} type="submit">
          Register
        </Button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

export default connect(mapStateToProps)(withRouter(NewServiceForm));
