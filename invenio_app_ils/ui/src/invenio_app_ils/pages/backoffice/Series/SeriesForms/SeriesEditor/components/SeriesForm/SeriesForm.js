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
import { series as seriesApi } from '../../../../../../../common/api/series/series';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';

export class SeriesForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
  }
  prepareData = data => {
    return _.pick(data, [
      'title',
      'abstract',
      'authors',
      'edition',
      'issn',
      'languages',
      'mode_of_issuance',
    ]);
  };

  onSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      const response = !isEmpty(this.formInitialData)
        ? await seriesApi.update(this.formInitialData.pid, values)
        : await seriesApi.create(values);

      this.props.sendSuccessNotification('Success!', this.successSubmitMessage);
      goTo(
        BackOfficeRoutes.seriesDetailsFor(getIn(response, 'data.metadata.pid'))
      );
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

  getLanguageCodes = () => {
    return IsoLanguages.getAllCodes().map((code, index) => ({
      text: code,
      value: code,
    }));
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
                <StringField label="Title" fieldPath="title" required />
                <SelectField
                  label="Mode of issuance"
                  fieldPath="mode_of_issuance"
                  options={[
                    {
                      text: 'MULTIPART_MONOGRAPH',
                      value: 'MULTIPART_MONOGRAPH',
                    },
                    {
                      text: 'SERIAL',
                      value: 'SERIAL',
                    },
                  ]}
                  required
                ></SelectField>
                <TextField
                  label="Abstract"
                  fieldPath="abstract"
                  uiProps={{ rows: 10 }}
                />
                <ArrayStringField
                  label="Authors"
                  fieldPath="authors"
                ></ArrayStringField>
                <SelectField
                  multiple
                  label="Languages"
                  fieldPath="languages"
                  options={this.getLanguageCodes()}
                  uiProps={{ upward: false }}
                ></SelectField>
                <StringField label="Edition" fieldPath="edition" />
                <StringField label="ISSN" fieldPath="issn" />
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
