// EditUserDialog.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { StringField, TextField } from '../../../../../../../forms';
import { location as locationApi } from '../../../../../../../common/api/locations/location';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import { BaseForm } from '../../../../../../../forms';

export class LocationForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
    this.pid = props.pid;
  }
  prepareData = data => {
    return _.pick(data, ['name', 'address', 'email', 'phone', 'notes']);
  };

  updateLocation = (pid, data) => {
    return locationApi.update(pid, data);
  };

  createLocation = data => {
    return locationApi.create(data);
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
        editApiMethod={this.updateLocation}
        createApiMethod={this.createLocation}
        successCallback={this.successCallback}
        successSubmitMessage={this.successSubmitMessage}
        title={this.title}
        pid={this.pid ? this.pid : undefined}
      >
        <StringField label="Name" fieldPath="name" required />
        <StringField label="Address" fieldPath="address" />
        <StringField label="Email" fieldPath="email" />
        <StringField label="Phone" fieldPath="phone" />
        <TextField label="Notes" fieldPath="notes" uiProps={{ rows: 5 }} />
      </BaseForm>
    );
  }
}

LocationForm.propTypes = {
  formInitialData: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
