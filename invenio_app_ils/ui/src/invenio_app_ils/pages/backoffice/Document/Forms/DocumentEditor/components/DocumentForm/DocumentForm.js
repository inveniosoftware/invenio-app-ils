import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { BaseForm, StringField } from '../../../../../../../forms';
import { document as documentApi } from '../../../../../../../common/api/documents/document';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import { TagsField } from './components';
import documentSubmitSerializer from './documentSubmitSerializer';

export class DocumentForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
    this.pid = props.pid;
  }

  updateDocument = (pid, data) => {
    return documentApi.update(pid, data);
  };

  createDocument = data => {
    return documentApi.create(data);
  };

  successCallback = response => {
    goTo(
      BackOfficeRoutes.documentDetailsFor(getIn(response, 'data.metadata.pid'))
    );
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
        pid={this.pid ? this.pid : undefined}
        submitSerializer={documentSubmitSerializer}
      >
        <StringField label="Title" fieldPath="title" required />
        <TagsField label="Tags" fieldPath="tags" />
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
