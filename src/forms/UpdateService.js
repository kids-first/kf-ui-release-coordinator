import React from 'react';
import {Formik} from 'formik';
import {Form} from 'semantic-ui-react';

const UpdateServiceForm = ({service, onSubmit, formRef}) => {
  return (
    <Formik
      initialValues={{...service}}
      onSubmit={(values, actions) => {
        onSubmit(values);
      }}
      render={props => (
        <Form onSubmit={props.handleSubmit} ref={formRef}>
          <Form.Field>
            <label>Name</label>
            <input
              type="text"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.name}
              name="name"
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <Form.TextArea
              type="text"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.description}
              name="description"
            />
          </Form.Field>
          <Form.Field>
            <label>Url</label>
            <input
              type="text"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.url}
              name="url"
            />
          </Form.Field>
        </Form>
      )}
    />
  );
};

export default UpdateServiceForm;
