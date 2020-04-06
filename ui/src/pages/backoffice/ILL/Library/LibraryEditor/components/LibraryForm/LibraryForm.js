import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { BaseForm, StringField, TextField } from '@forms';
import { illLibrary as libraryApi } from '@api';
import { ILLRoutes } from '@routes/urls';
import { goTo } from '@history';

export class LibraryForm extends Component {
  get buttons() {
    if (this.props.pid) {
      return null;
    }

    return [
      {
        name: 'create',
        content: 'Create library',
        primary: true,
        type: 'submit',
      },
    ];
  }

  updateLibrary = (pid, data) => {
    return libraryApi.update(pid, data);
  };

  createLibrary = data => {
    return libraryApi.create(data);
  };

  successCallback = (response, submitButton) => {
    const library = getIn(response, 'data');
    goTo(ILLRoutes.libraryDetailsFor(library.metadata.pid));
  };

  render() {
    return (
      <BaseForm
        initialValues={this.props.data ? this.props.data.metadata : {}}
        editApiMethod={this.updateLibrary}
        createApiMethod={this.createLibrary}
        successCallback={this.successCallback}
        successSubmitMessage={this.props.successSubmitMessage}
        title={this.props.title}
        pid={this.props.pid}
        buttons={this.buttons}
      >
        <StringField label="Name" fieldPath="name" required optimized />
        <TextField label="Notes" fieldPath="notes" rows={5} optimized />
      </BaseForm>
    );
  }
}

LibraryForm.propTypes = {
  formInitialData: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
