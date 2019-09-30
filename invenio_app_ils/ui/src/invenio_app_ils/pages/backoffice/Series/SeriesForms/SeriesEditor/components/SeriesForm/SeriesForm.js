// EditUserDialog.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import _ from 'lodash';
import IsoLanguages from 'iso-639-1';
import {
  ArrayStringField,
  BaseForm,
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
    this.pid = props.pid;
    this.languageCodes = this.getLanguageCodes();
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

  updateSeries = (pid, data) => {
    return seriesApi.update(pid, data);
  };

  createSeries = data => {
    return seriesApi.create(data);
  };

  successCallback = response => {
    goTo(
      BackOfficeRoutes.seriesDetailsFor(getIn(response, 'data.metadata.pid'))
    );
  };

  getLanguageCodes = () => {
    return IsoLanguages.getAllCodes().map((code, index) => ({
      text: code,
      value: code,
    }));
  };

  render() {
    return (
      <BaseForm
        initialValues={
          this.formInitialData
            ? this.prepareData(this.formInitialData.metadata)
            : {}
        }
        editApiMethod={this.updateSeries}
        createApiMethod={this.createSeries}
        successCallback={this.successCallback}
        successSubmitMessage={this.successSubmitMessage}
        title={this.title}
        pid={this.pid ? this.pid : undefined}
      >
        <StringField label="Title" fieldPath="title" required />
        <SelectField
          label="Mode of issuance"
          fieldPath="mode_of_issuance"
          options={[
            {
              text: 'MULTIPART MONOGRAPH',
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
          options={this.languageCodes}
          uiProps={{ upward: false }}
        ></SelectField>
        <StringField label="Edition" fieldPath="edition" />
        <StringField label="ISSN" fieldPath="issn" />
      </BaseForm>
    );
  }
}

SeriesForm.propTypes = {
  formInitialData: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
