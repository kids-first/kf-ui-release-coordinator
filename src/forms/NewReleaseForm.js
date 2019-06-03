import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {Formik, Field} from 'formik';
import {
  Button,
  Checkbox,
  Confirm,
  Form,
  Icon,
  Label,
  Modal,
} from 'semantic-ui-react';
import {coordinatorApi} from '../globalConfig';
import StudiesContainer from '../containers/StudiesContainer';
import ServiceList from '../components/ServiceList';

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

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(true);
    let release = {
      name: values.title,
      description: '',
      studies: props.studies,
      tags: [],
      is_major: values.isMajor,
      author: props.user.name,
    };
    setRelease(release);

    setConfirmOpen(true);
    actions.setSubmitting(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  const handleConfirm = () => {
    axios
      .post(`${coordinatorApi}/releases`, release)
      .then(resp => {
        props.history.push(`/releases/${resp.data.kf_id}`);
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

            <label>Services to be run for this release</label>
            <ServiceList />

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
        confirmButton="Let 'er rip"
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
                  <Label color="pink" icon="database">
                    {sd}
                  </Label>
                ))}
              </Label.Group>
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
