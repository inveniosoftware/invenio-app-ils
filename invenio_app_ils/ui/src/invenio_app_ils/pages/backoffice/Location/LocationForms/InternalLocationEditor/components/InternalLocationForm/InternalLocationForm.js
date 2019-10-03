import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import { StringField, TextField } from '../../../../../../../forms';
import { internalLocation as internalLocationApi } from '../../../../../../../common/api/locations/internalLocation';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import { BaseForm } from '../../../../../../../forms';

export class InternalLocationForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
    this.pid = props.pid;
  }

  prepareData = data => {
    return pick(data, ['name', 'location_pid', 'physical_location', 'notes']);
  };

  updateInternalLocation = (pid, data) => {
    return internalLocationApi.update(pid, data);
  };

  createInternalLocation = async data => {
    return internalLocationApi.create(data);
  };

  successCallback = () => goTo(BackOfficeRoutes.locationsList);

  render() {
    return (
      <BaseForm
        initialValues={
          this.formInitialData
            ? this.prepareData(this.formInitialData.metadata)
            : {}
        }
        editApiMethod={this.updateInternalLocation}
        createApiMethod={this.createInternalLocation}
        successCallback={this.successCallback}
        successSubmitMessage={this.successSubmitMessage}
        title={this.title}
        pid={this.pid ? this.pid : undefined}
      >
        <StringField label="Name" fieldPath="name" required />
        {/* TODO make this an autocompletion field from `location.list` endpoint */}
        <StringField label="Location pid" fieldPath="location_pid" required />
        <StringField label="Physical Location" fieldPath="physical_location" />
        <TextField label="Notes" fieldPath="notes" uiProps={{ rows: 5 }} />
      </BaseForm>
    );
  }
}

InternalLocationForm.propTypes = {
  formInitialData: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
