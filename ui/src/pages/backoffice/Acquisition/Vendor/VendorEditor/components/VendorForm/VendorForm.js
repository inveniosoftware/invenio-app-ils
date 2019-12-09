import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import { getIn } from 'formik';
import { StringField, TextField } from '@forms';
import { vendor as vendorApi } from '@api/acquisition/vendor';
import { AcquisitionRoutes } from '@routes/urls';
import { goTo } from '@history';
import { BaseForm } from '@forms';

export class VendorForm extends Component {
  prepareData = data => {
    return pick(data, ['name', 'address', 'email', 'phone', 'notes']);
  };

  createVendor = data => {
    return vendorApi.create(data);
  };

  updateVendor = (pid, data) => {
    return vendorApi.update(pid, data);
  };

  successCallback = response => {
    goTo(
      AcquisitionRoutes.vendorDetailsFor(getIn(response, 'data.metadata.pid'))
    );
  };

  render() {
    return (
      <BaseForm
        initialValues={
          this.props.data ? this.prepareData(this.props.data.metadata) : {}
        }
        editApiMethod={this.updateVendor}
        createApiMethod={this.createVendor}
        successCallback={this.successCallback}
        successSubmitMessage={this.props.successSubmitMessage}
        title={this.props.title}
        pid={this.props.pid ? this.props.pid : undefined}
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

VendorForm.propTypes = {
  data: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
