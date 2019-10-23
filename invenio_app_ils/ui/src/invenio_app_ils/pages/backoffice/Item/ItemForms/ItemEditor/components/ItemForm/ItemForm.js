import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import pick from 'lodash/pick';
import {
  BaseForm,
  StringField,
  TextField,
  SelectField,
  GroupField,
  SelectorField,
} from '../../../../../../../forms';
import { item as itemApi } from '../../../../../../../common/api/items/item';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import itemSubmitSerializer from './itemSubmitSerializer';
import { invenioConfig } from '../../../../../../../common/config';
import {
  document as documentApi,
  internalLocation as internalLocationApi,
} from '../../../../../../../common/api';
import {
  serializeDocument,
  serializeInternalLocation,
} from '../../../../../../../common/components/ESSelector/serializer';

export class ItemForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
    this.pid = props.pid;
    this.config = invenioConfig.items;
  }

  prepareData = data => {
    return pick(data, [
      'barcode',
      'circulation_restriction',
      'description',
      'document_pid',
      'document',
      'internal_location_pid',
      'internal_location',
      'internal_notes',
      'isbn',
      'legayc_id',
      'legacy_library_id',
      'medium',
      'number_of_pages',
      'physical_description',
      'shelf',
      'status',
    ]);
  };

  update = (pid, data) => {
    return itemApi.update(pid, data);
  };

  create = data => {
    return itemApi.create(data);
  };

  successCallback = response => {
    goTo(BackOfficeRoutes.itemDetailsFor(getIn(response, 'data.metadata.pid')));
  };

  render() {
    return (
      <BaseForm
        initialValues={
          this.formInitialData
            ? this.prepareData(this.formInitialData.metadata)
            : {}
        }
        editApiMethod={this.update}
        createApiMethod={this.create}
        successCallback={this.successCallback}
        successSubmitMessage={this.successSubmitMessage}
        title={this.title}
        pid={this.pid ? this.pid : undefined}
        submitSerializer={itemSubmitSerializer}
      >
        <StringField required label="Barcode" fieldPath="barcode" />
        <SelectField
          required
          search
          label="Circulation restriction"
          fieldPath="circulation_restriction"
          options={this.config.circulationRestrictions}
        />
        <TextField label="Description" fieldPath="description" rows={5} />
        <SelectorField
          required
          emptyHeader="No document selected"
          emptyDescription="Please select a document."
          fieldPath="document"
          errorPath="document_pid"
          label="Document"
          placeholder="Search for a document..."
          query={documentApi.list}
          serializer={serializeDocument}
        />
        <SelectorField
          required
          emptyHeader="No internal location selected"
          emptyDescription="Please select an internal location."
          fieldPath="internal_location"
          errorPath="internal_location_pid"
          label="Internal location"
          placeholder="Search for an internal location..."
          query={internalLocationApi.list}
          serializer={serializeInternalLocation}
        />
        <TextField label="Internal Notes" fieldPath="internal_notes" rows={5} />
        <GroupField error title="ISBN" widths="equal" fieldPath="isbn">
          <StringField required label="Value" fieldPath="isbn.value" />
          <TextField
            label="Description"
            fieldPath="isbn.description"
            rows={2}
          />
        </GroupField>
        <StringField label="Legacy ID" fieldPath="legacy_id" />
        <StringField label="Legacy library ID" fieldPath="legacy_library_id" />
        <SelectField
          required
          search
          label="Medium"
          fieldPath="medium"
          options={this.config.mediums}
        />
        <StringField label="Number of pages" fieldPath="number_of_pages" />
        <TextField
          label="Physical description"
          fieldPath="physical_description"
          rows={3}
        />
        <StringField label="Shelf" fieldPath="shelf" />
        <SelectField
          required
          search
          label="Status"
          fieldPath="status"
          options={this.config.statuses}
        />
      </BaseForm>
    );
  }
}

ItemForm.propTypes = {
  formInitialData: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
