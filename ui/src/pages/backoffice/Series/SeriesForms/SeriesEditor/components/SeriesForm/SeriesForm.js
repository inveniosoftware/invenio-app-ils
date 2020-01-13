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
  LanguageField,
  GroupField,
  DeleteActionButton,
  UrlsField,
} from '@forms';
import { series as seriesApi } from '@api/series/series';
import { BackOfficeRoutes } from '@routes/urls';
import { goTo } from '@history';
import { invenioConfig } from '@config';
import {
  Identifiers,
  AlternativeTitles,
} from '@pages/backoffice/Document/DocumentForms/DocumentEditor/components/DocumentForm/components';
import { InternalNotes } from '@pages/backoffice/Document/DocumentForms/DocumentEditor/components/DocumentForm/components/InternalNotes';
import { AccessUrls } from './AccessUrls';

export class SeriesForm extends Component {
  prepareData = data => {
    return pick(data, [
      'abbreviated_title',
      'abstract',
      'access_urls',
      'alternative_titles',
      'authors',
      'edition',
      'identifiers',
      'internal_notes',
      'issn',
      'languages',
      'mode_of_issuance',
      'note',
      'publisher',
      'title',
      'urls',
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
        <StringField
          label="Abbreviated title"
          fieldPath="abbreviated_title"
          required
        />
        <AlternativeTitles />
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
        <LanguageField
          multiple
          fieldPath="languages"
          type={invenioConfig.vocabularies.series.language}
        />
        <StringField label="Edition" fieldPath="edition" />
        <StringField fieldPath="publisher" label="Publisher" />
        <UrlsField />
        <AccessUrls />
        <Identifiers
          vocabularies={{
            scheme: invenioConfig.vocabularies.series.identifier.scheme,
          }}
        />
        <TextField label="Notes" fieldPath="note" rows={5} optimized />
        <InternalNotes />
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
