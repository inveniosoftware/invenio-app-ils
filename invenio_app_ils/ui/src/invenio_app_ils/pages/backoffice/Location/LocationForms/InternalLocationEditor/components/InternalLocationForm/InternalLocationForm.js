// EditUserDialog.js
import React, { Component } from 'react';
import { Formik, getIn } from 'formik';
import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import { Form, Segment, Button, Grid, Header } from 'semantic-ui-react';
import { StringField, TextField } from '../../../../../../../forms';
import { internalLocation as internalLocationApi } from '../../../../../../../common/api/locations/internalLocation';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import { ES_DELAY } from '../../../../../../../common/config';

export class InternalLocationForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
  }
  prepareData = data => {
    return _.pick(data, ['name', 'location_pid', 'physical_location', 'notes']);
  };

  onSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      !isEmpty(this.formInitialData)
        ? await internalLocationApi.update(this.formInitialData.pid, values)
        : await internalLocationApi.create(values);

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
                {/* TODO make this an autocompletion field from `location.list` endpoint */}
                <StringField
                  label="Location pid"
                  fieldPath="location_pid"
                  required
                />
                <StringField
                  label="Physical Location"
                  fieldPath="physical_location"
                />
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
