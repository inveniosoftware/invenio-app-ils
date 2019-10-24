import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik, getIn } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { Form, Button, Grid, Header, Container } from 'semantic-ui-react';
import { ES_DELAY } from '../../../common/config';

export class BaseForm extends Component {
  constructor(props) {
    super(props);
    this.initialValues = props.initialValues;
    this.successSubmitMessage = props.successSubmitMessage;
    this.successCallback = props.successCallback;
    this.createApiMethod = props.createApiMethod;
    this.editApiMethod = props.editApiMethod;
    this.submitSerializer = props.submitSerializer || this._submitSerializer;
    this.title = props.title;
    this.pid = props.pid;
    this.validationSchema = props.validationSchema;
  }

  _submitSerializer = values => ({ ...values });

  onSubmit = async (values, actions) => {
    const submittingValues = this.submitSerializer(values);
    try {
      actions.setSubmitting(true);
      const response = this.pid
        ? await this.editApiMethod(this.pid, submittingValues)
        : await this.createApiMethod(submittingValues);

      setTimeout(() => {
        this.props.sendSuccessNotification(
          'Success!',
          this.successSubmitMessage
        );
        if (this.successCallback) {
          this.successCallback(response);
        }
      }, ES_DELAY);
    } catch (error) {
      const errors = getIn(error, 'response.data.errors', []);

      if (isEmpty(errors)) {
        throw error;
      } else {
        const errorData = error.response.data;
        const payload = {};
        for (const fieldError of errorData.errors) {
          payload[fieldError.field] = fieldError.message;
        }
        actions.setErrors(payload);
        actions.setSubmitting(false);
      }
    }
  };

  render() {
    return (
      <Container>
        {this.title && (
          <Grid>
            <Grid.Row centered>
              <Header>{this.title}</Header>
            </Grid.Row>
          </Grid>
        )}
        <Formik
          initialValues={this.initialValues}
          onSubmit={this.props.onSubmit || this.onSubmit}
          validationSchema={this.validationSchema}
          render={({ isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} loading={isSubmitting}>
              {this.props.children}
              <Button color="green" disabled={isSubmitting} type="submit">
                Submit
              </Button>
            </Form>
          )}
        />
      </Container>
    );
  }
}

BaseForm.propTypes = {
  initialValues: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  successCallback: PropTypes.func,
  createApiMethod: PropTypes.func,
  editApiMethod: PropTypes.func,
  submitSerializer: PropTypes.func,
  title: PropTypes.string,
  pid: PropTypes.string,
  validationSchema: PropTypes.object,
  onSubmit: PropTypes.func,
};
