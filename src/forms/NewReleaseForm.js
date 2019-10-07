import React, {Fragment, useState} from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Formik, Field} from 'formik';
import {
  Button,
  Checkbox,
  Confirm,
  Form,
  Icon,
  Label,
  Message,
  Modal,
} from 'semantic-ui-react';
import StudiesContainer from '../containers/StudiesContainer';
import ServiceList from '../components/ServiceList';

import {START_RELEASE} from '../mutations';
import {ALL_SERVICES} from '../queries';

const SemanticField = ({component, ...fieldProps}) => (
  <Field
    {...fieldProps}
    render={({
      field: {value, onBlur, ...field},
      form: {setFieldValue, setFieldTouched},
      ...props
    }) =>
      React.createElement(component, {
        ...fieldProps,
        ...field,
        ...props,
        ...(typeof value === 'boolean'
          ? {
              checked: value,
            }
          : {
              value,
            }),
        onChange: (e, {value: newValue, checked}) =>
          setFieldValue(fieldProps.name, newValue || checked),
        onBlur: (e, blurProps) =>
          blurProps
            ? setFieldTouched(fieldProps.name, blurProps.value)
            : onBlur(e),
      })
    }
  />
);

const NewReleaseForm = props => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [release, setRelease] = useState({});

  const [
    startRelease,
    {loading: startReleaseLoading, error: startReleaseError},
  ] = useMutation(START_RELEASE);

  const {
    loading: servicesLoading,
    error: servicesError,
    data: services,
  } = useQuery(ALL_SERVICES);

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(true);

    const studies = props.studies.map(study =>
      Buffer.from('StudyNode:' + study).toString('base64'),
    );

    let release = {
      name: values.title,
      description: '',
      studies,
      isMajor: values.isMajor,
    };

    setRelease(release);

    setConfirmOpen(true);
    actions.setSubmitting(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  const handleConfirm = () => {
    startRelease({variables: {input: release}})
      .then(resp => {
        props.history.push(`/releases/${resp.data.startRelease.release.kfId}`);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <Formik
        initialValues={{title: '', isMajor: false, studies: []}}
        validate={values => {
          const errors = {};
          if (!values.title) {
            errors.title = 'A title is required';
          }
          if (props.studies.length <= 0) {
            errors.studies = 'At least one study is required';
          }
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          isValidating,
        }) => (
          <Form>
            <SemanticField
              label="Release Title"
              name="title"
              component={Form.Input}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              error={errors.title !== undefined}
            />

            <Form.Field>
              <label>Is this a major release</label>
              <SemanticField name="isMajor" component={Checkbox} />
              {errors.isMajor && (
                <Label basic color="red" pointing>
                  {errors.isMajor}
                </Label>
              )}
            </Form.Field>

            <Field
              name="studies"
              component={StudiesContainer}
              selectable
              defaultPageSize={10}
            />
            {errors.studies && touched.studies && (
              <Label basic color="red" pointing>
                {errors.studies}
              </Label>
            )}

            <Form.Field>
              <label>Services to be run for this release</label>
              <ServiceList
                loading={servicesLoading}
                error={servicesError}
                services={
                  services &&
                  services.allTaskServices &&
                  services.allTaskServices.edges
                }
              />
            </Form.Field>

            <Button
              type="submit"
              primary
              size="large"
              floated="right"
              icon
              labelPosition="right"
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              Start the Release
              <Icon name="play" />
            </Button>
          </Form>
        )}
      </Formik>

      <Confirm
        open={confirmOpen}
        cancelButton="Noooooo"
        confirmButton={
          <Button loading={startReleaseLoading}>Let 'er rip</Button>
        }
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        header={`About to start release: '${release.name}'`}
        content={
          <Modal.Content>
            <p>
              This <b>{release.is_major ? 'will' : 'will not'}</b> be a major
              release.
            </p>
            These studies will be staged for review. This will not affect any
            public facing data until it is reviewed and published.
            {release.studies && (
              <Label.Group>
                {release.studies.map(sd => (
                  <Label basic key={sd}>
                    <Icon name="database" />
                    {sd}
                  </Label>
                ))}
              </Label.Group>
            )}
            {startReleaseError && (
              <Message
                negative
                header="Error"
                content={
                  startReleaseError.networkError +
                  startReleaseError.graphQLErrors
                }
              />
            )}
          </Modal.Content>
        }
      />
    </Fragment>
  );
};

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    studies: state.studies.selected.items,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(NewReleaseForm));
