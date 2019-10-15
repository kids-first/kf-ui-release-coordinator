import React from 'react';
import {useMutation} from '@apollo/react-hooks';
import {withRouter} from 'react-router-dom';
import {Button, Form, Message} from 'semantic-ui-react';

import {CREATE_SERVICE} from '../mutations';

const NewServiceForm = ({history}) => {
  const [
    createService,
    {loading: createServiceLoading, error: createServiceError},
  ] = useMutation(CREATE_SERVICE);

  const handleSubmit = e => {
    e.preventDefault();
    const values = e.target;

    const service = {
      name: values.name.value,
      description: values.description.value,
      url: values.url.value,
    };

    createService({variables: {input: service}}).then(resp => {
      history.push(`/services/${resp.data.createTaskService.taskService.kfId}`);
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
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
      {createServiceError && (
        <Message negative header="Error" content={createServiceError.message} />
      )}
      <Button
        primary
        loading={createServiceLoading}
        type="submit"
        floated="right"
      >
        Register
      </Button>
    </Form>
  );
};

export default withRouter(NewServiceForm);
