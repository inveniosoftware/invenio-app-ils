import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import { SelectorField, StringField, TextField } from '@forms';
import { internalLocation as internalLocationApi } from '@api/locations/internalLocation';
import { BackOfficeRoutes } from '@routes/urls';
import { goTo } from '@history';
import { BaseForm } from '@forms';
import { location as locationApi } from '@api';
import { serializeLocation } from '@components/ESSelector/serializer';

export class InternalLocationForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
    this.pid = props.pid;
  }

  prepareData = data => {
    return pick(data, [
      'name',
      'location',
      'location_pid',
      'physical_location',
      'notes',
    ]);
  };

  updateInternalLocation = (pid, data) => {
    return internalLocationApi.update(pid, data);
  };

  createInternalLocation = async data => {
    return internalLocationApi.create(data);
  };

  successCallback = () => goTo(BackOfficeRoutes.locationsList);

  submitSerializer = values => {
    const submitValues = { ...values };
    submitValues.location_pid = values.location.pid;
    delete submitValues.location;
    return submitValues;
  };

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
        submitSerializer={this.submitSerializer}
      >
        <StringField label="Name" fieldPath="name" required />
        <SelectorField
          required
          emptyHeader="No location selected"
          emptyDescription="Please select a location."
          fieldPath="location"
          errorPath="location_pid"
          label="Location"
          placeholder="Search for a location..."
          query={locationApi.list}
          serializer={serializeLocation}
        />
        <StringField label="Physical Location" fieldPath="physical_location" />
        <TextField label="Notes" fieldPath="notes" rows={5} />
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
