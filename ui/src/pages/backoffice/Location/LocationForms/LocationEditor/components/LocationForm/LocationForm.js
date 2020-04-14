import { location as locationApi } from '@api/locations/location';
import { delay } from '@api/utils';
import { BaseForm, StringField, TextField } from '@forms';
import { goTo } from '@history';
import { BackOfficeRoutes } from '@routes/urls';
import pick from 'lodash/pick';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export class LocationForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
    this.pid = props.pid;
  }
  prepareData = data => {
    return pick(data, ['name', 'address', 'email', 'phone', 'notes']);
  };

  updateLocation = async (pid, data) => {
    const response = await locationApi.update(pid, data);
    await delay();
    return response;
  };

  createLocation = async data => {
    const response = await locationApi.create(data);
    await delay();
    return response;
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
        <TextField label="Notes" fieldPath="notes" rows={5} />
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
