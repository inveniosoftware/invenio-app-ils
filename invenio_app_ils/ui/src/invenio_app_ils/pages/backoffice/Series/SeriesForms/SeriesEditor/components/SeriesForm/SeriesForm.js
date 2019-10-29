// EditUserDialog.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import pick from 'lodash/pick';
import {
  ArrayField,
  BaseForm,
  SelectField,
  StringField,
  TextField,
  LanguagesField,
  GroupField,
  DeleteActionButton,
} from '../../../../../../../forms';
import { series as seriesApi } from '../../../../../../../common/api/series/series';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';

export class SeriesForm extends Component {
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
      <GroupField basic>
        <StringField
          fieldPath={`${arrayPath}.${indexPath}`}
          action={
            <DeleteActionButton
              icon="trash"
              onClick={() => arrayHelpers.remove(indexPath)}
            />
          }
        />
      </GroupField>
    );
  };

  render() {
    const initialValues = this.props.data
      ? this.prepareData(this.props.data.metadata)
      : {};
    return (
      <BaseForm
        initialValues={{
          mode_of_issuance: 'MULTIPART_MONOGRAPH',
          ...initialValues,
        }}
        editApiMethod={this.updateSeries}
        createApiMethod={this.createSeries}
        successCallback={this.successCallback}
        successSubmitMessage={this.successSubmitMessage}
        title={this.props.title}
        pid={this.props.pid}
      >
        <StringField label="Title" fieldPath="title" required />
        <SelectField
          required
          search
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
        />
        <TextField label="Abstract" fieldPath="abstract" rows={10} />
        <ArrayField
          fieldPath="authors"
          label="Authors"
          defaultNewValue=""
          renderArrayItem={this.renderAuthorsField}
          addButtonLabel="Add new author"
        />
        <LanguagesField multiple fieldPath="languages" />
        <StringField label="Edition" fieldPath="edition" />
        <StringField label="ISSN" fieldPath="issn" />
      </BaseForm>
    );
  }
}

SeriesForm.propTypes = {
  data: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
