// EditUserDialog.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { Form } from 'semantic-ui-react';
import pick from 'lodash/pick';
import {
  ArrayField,
  BaseForm,
  SelectField,
  StringField,
  TextField,
  LanguagesField,
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
  }
  prepareData = data => {
    return pick(data, [
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

  renderAuthorsField = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    return (
      <StringField
        fieldPath={`${arrayPath}.${indexPath}`}
        action={
          <Form.Button
            color="red"
            icon="trash"
            type="button"
            onClick={() => {
              arrayHelpers.remove(indexPath);
            }}
          ></Form.Button>
        }
      />
    );
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
          search
        />
        <TextField label="Abstract" fieldPath="abstract" rows={10} />
        <ArrayField
          fieldPath="authors"
          label="Authors"
          defaultNewValue=""
          renderArrayItem={this.renderAuthorsField}
        />
        <LanguagesField />
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
