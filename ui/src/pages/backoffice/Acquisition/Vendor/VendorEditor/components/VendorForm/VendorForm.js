import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { StringField, TextField } from '@forms';
import { acqVendor as vendorApi } from '@api';
import { AcquisitionRoutes } from '@routes/urls';
import { goTo } from '@history';
import { BaseForm } from '@forms';
import { Segment } from 'semantic-ui-react';

export class VendorForm extends Component {
  get buttons() {
    const isEditing = this.props.pid;
    const buttons = isEditing
      ? [
          {
            name: 'update',
            content: 'Update vendor',
            primary: true,
            type: 'submit',
          },
        ]
      : [
          {
            name: 'create',
            content: 'Create vendor',
            primary: true,
            type: 'submit',
          },
        ];
    return buttons;
  }

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
        initialValues={this.props.data ? this.props.data.metadata : {}}
        editApiMethod={this.updateVendor}
        createApiMethod={this.createVendor}
        successCallback={this.successCallback}
        successSubmitMessage={this.props.successSubmitMessage}
        title={this.props.title}
        pid={this.props.pid}
        buttons={this.buttons}
      >
        <Segment raised>
          <StringField label="Name" fieldPath="name" required />
          <StringField label="Address" fieldPath="address" />
          <StringField label="Email" fieldPath="email" />
          <StringField label="Phone" fieldPath="phone" />
          <TextField label="Notes" fieldPath="notes" rows={5} />
        </Segment>
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
