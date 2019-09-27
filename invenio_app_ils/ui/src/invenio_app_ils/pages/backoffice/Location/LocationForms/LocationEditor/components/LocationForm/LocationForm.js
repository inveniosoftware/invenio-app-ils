// EditUserDialog.js
import React, { Component } from 'react';
import { Formik, getIn } from 'formik';
import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import IsoLanguages from 'iso-639-1';
import { Form, Segment, Button, Grid, Header } from 'semantic-ui-react';
import {
  ArrayStringField,
  SelectField,
  StringField,
  TextField,
} from '../../../../../../../forms';
import { location as locationApi } from '../../../../../../../common/api/locations/location';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import { ES_DELAY } from '../../../../../../../common/config';

export class LocationForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
  }
  prepareData = data => {
    return _.pick(data, ['name', 'address', 'email', 'phone', 'notes']);
  };

  onSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      const response = !isEmpty(this.formInitialData)
        ? await locationApi.update(this.formInitialData.pid, values)
        : await locationApi.create(values);

      setTimeout(() => {
        this.props.sendSuccessNotification(
          'Success!',
          this.successSubmitMessage
        );
        goTo(BackOfficeRoutes.locationsList);
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
      <>
        <Grid>
          <Grid.Row centered>
            <Header>{this.title}</Header>
          </Grid.Row>
        </Grid>

        <Formik
          initialValues={
            this.formInitialData
              ? this.prepareData(this.formInitialData.metadata)
              : {}
          }
          onSubmit={this.onSubmit}
          render={({ isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} loading={isSubmitting}>
              <Segment>
                <StringField label="Name" fieldPath="name" required />
                <StringField label="Address" fieldPath="address" />
                <StringField
                  label="Email"
                  fieldPath="email"
                  uiProps={{ rows: 10 }}
                />
                <StringField label="Phone" fieldPath="phone" />
                <TextField
                  label="Notes"
                  fieldPath="notes"
                  uiProps={{ rows: 5 }}
                />
              </Segment>
              <Button color="green" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        />
      </>
    );
  }
}
