import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { BaseForm, StringField, SelectorField, TextField } from '@forms';
import {
  illBorrowingRequest as illBorrowingRequestApi,
  illLibrary as illLibraryApi,
} from '@api';
import { serializeLibrary } from '@components/ESSelector/serializer';
import { ILLRoutes } from '@routes/urls';
import { goTo } from '@history';

export class BorrowingRequestForm extends Component {
  get buttons() {
    if (this.props.pid) {
      return null;
    }

    return [
      {
        name: 'create',
        content: 'Create borrowing request',
        primary: true,
        type: 'submit',
      },
    ];
  }

  updateBorrowingRequest = (pid, data) => {
    return illBorrowingRequestApi.update(pid, data);
  };

  createBorrowingRequest = data => {
    return illBorrowingRequestApi.create(data);
  };

  successCallback = (response, submitButton) => {
    const borrowingRequest = getIn(response, 'data');
    goTo(ILLRoutes.borrowingRequestDetailsFor(borrowingRequest.metadata.pid));
  };

  render() {
    return (
      <BaseForm
        initialValues={this.props.data ? this.props.data.metadata : {}}
        editApiMethod={this.updateBorrowingRequest}
        createApiMethod={this.createBorrowingRequest}
        successCallback={this.successCallback}
        successSubmitMessage={this.props.successSubmitMessage}
        title={this.props.title}
        pid={this.props.pid}
        buttons={this.buttons}
      >
        <StringField label="Status" fieldPath="status" required optimized />
        <StringField
          label="Cancel reason"
          fieldPath="cancel_reason"
          optimized
        />
        <SelectorField
          required
          emptyHeader="No library selected"
          emptyDescription="Please select a library."
          fieldPath="library"
          errorPath="library_pid"
          label="Library"
          placeholder="Search for a library..."
          illLuery={illLibraryApi.list}
          serializer={serializeLibrary}
        />
        <TextField label="Notes" fieldPath="notes" rows={5} optimized />
      </BaseForm>
    );
  }
}

BorrowingRequestForm.propTypes = {
  formInitialData: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
