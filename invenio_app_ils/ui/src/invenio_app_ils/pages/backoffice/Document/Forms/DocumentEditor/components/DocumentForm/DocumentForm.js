import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import {
  BaseForm,
  StringField,
  TextField,
  BooleanField,
  GroupField,
} from '../../../../../../../forms';
import { document as documentApi } from '../../../../../../../common/api/documents/document';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import { UrlsField } from '../../../../../../../forms';
import {
  AlternativeAbstracts,
  AuthorsField,
  TagsField,
  TableOfContent,
  AlternativeIdentifiers,
  AlternativeTitles,
  Subjects,
  LicensesField,
  Identifiers,
  Copyrights,
  PublicationInfoField,
} from './components';
import documentSubmitSerializer from './documentSubmitSerializer';
import { InternalNotes } from './components/InternalNotes';
import { ConferenceInfoField } from './components/ConferenceInfoField';
import { Imprints } from './components/Imprints';
import { Keywords } from './components/Keywords';

export class DocumentForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
    this.pid = props.pid;
  }

  get buttons() {
    if (this.props.pid) {
      return null;
    }

    return [
      {
        name: 'create',
        content: 'Create document',
        primary: true,
        type: 'submit',
      },
      {
        name: 'create-with-item',
        content: 'Create document and item',
        secondary: true,
        type: 'button',
      },
      {
        name: 'create-with-eitem',
        content: 'Create document and eitem',
        secondary: true,
        type: 'button',
      },
    ];
  }

  updateDocument = (pid, data) => {
    return documentApi.update(pid, data);
  };

  createDocument = data => {
    return documentApi.create(data);
  };

  successCallback = (response, submitButton) => {
    const doc = getIn(response, 'data');
    if (submitButton === 'create-with-item') {
      goTo(BackOfficeRoutes.itemCreate, { document: doc });
    } else if (submitButton === 'create-with-eitem') {
      goTo(BackOfficeRoutes.eitemCreate, { document: doc });
    } else {
      goTo(BackOfficeRoutes.documentDetailsFor(doc.metadata.pid));
    }
  };

  render() {
    return (
      <BaseForm
        initialValues={
          this.formInitialData ? this.formInitialData.metadata : {}
        }
        editApiMethod={this.updateDocument}
        createApiMethod={this.createDocument}
        successCallback={this.successCallback}
        successSubmitMessage={this.successSubmitMessage}
        title={this.title}
        pid={this.pid}
        submitSerializer={documentSubmitSerializer}
        buttons={this.buttons}
      >
        <StringField label="Title" fieldPath="title" required />
        <GroupField widths="equal">
          <StringField label="Document type" fieldPath="document_type" />
          <StringField label="Edition" fieldPath="edition" />
          <StringField label="Number of pages" fieldPath="number_of_pages" />
        </GroupField>
        <StringField label="Source of the metadata" fieldPath="source" />
        <AuthorsField fieldPath="authors" />
        <BooleanField label="Other authors" fieldPath="other_authors" toggle />
        <BooleanField label="Document is curated" fieldPath="curated" toggle />
        <TextField label="Abstract" fieldPath="abstract" rows={5} />
        <TextField label="Notes" fieldPath="note" rows={5} />
        <ConferenceInfoField />
        <AlternativeAbstracts />
        <LicensesField fieldPath="licenses" />
        {/* <TagsField label="Tags" fieldPath="tags" /> */}
        <TableOfContent />
        <UrlsField />
        <Subjects />
        <InternalNotes />
        <Identifiers />
        <AlternativeIdentifiers />
        <AlternativeTitles />
        <Copyrights />
        <PublicationInfoField />
        <Imprints />
        <Keywords />
      </BaseForm>
    );
  }
}

DocumentForm.propTypes = {
  formInitialData: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
