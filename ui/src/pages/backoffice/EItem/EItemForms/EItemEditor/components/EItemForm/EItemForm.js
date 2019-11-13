import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import pick from 'lodash/pick';
import {
  BaseForm,
  BooleanField,
  TextField,
  SelectorField,
  UrlsField,
} from '../../../../../../../forms';
import { eitem as eitemApi } from '../../../../../../../common/api/eitems/eitem';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import eitemSubmitSerializer from './eitemSubmitSerializer';
import { document as documentApi } from '../../../../../../../common/api';
import { serializeDocument } from '../../../../../../../common/components/ESSelector/serializer';

export class EItemForm extends Component {
  constructor(props) {
    super(props);
    this.data = props.data;
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
    this.pid = props.pid;
  }

  prepareData = data => {
    return pick(data, [
      'description',
      'document_pid',
      'document',
      'files',
      'internal_notes',
      'open_access',
      'urls',
    ]);
  };

  update = (pid, data) => {
    return eitemApi.update(pid, data);
  };

  create = data => {
    return eitemApi.create(data);
  };

  successCallback = response => {
    goTo(
      BackOfficeRoutes.eitemDetailsFor(getIn(response, 'data.metadata.pid'))
    );
  };

  render() {
    return (
      <BaseForm
        initialValues={this.data ? this.prepareData(this.data.metadata) : {}}
        editApiMethod={this.update}
        createApiMethod={this.create}
        successCallback={this.successCallback}
        successSubmitMessage={this.successSubmitMessage}
        title={this.title}
        pid={this.pid ? this.pid : undefined}
        submitSerializer={eitemSubmitSerializer}
      >
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
        <TextField label="Description" fieldPath="description" rows={5} />
        <BooleanField toggle label="Open access" fieldPath="open_access" />
        <UrlsField />
        <TextField label="Internal notes" fieldPath="internal_notes" rows={5} />
      </BaseForm>
    );
  }
}

EItemForm.propTypes = {
  data: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
