import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { Form } from 'semantic-ui-react';
import pick from 'lodash/pick';
import {
  BaseForm,
  BooleanField,
  StringField,
  AccordionField,
  ArrayField,
  TextField,
} from '../../../../../../../forms';
import { eitem as eitemApi } from '../../../../../../../common/api/eitems/eitem';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import { DocumentField } from './components';
import eitemSubmitSerializer from './eitemSubmitSerializer';

export class EItemForm extends Component {
  constructor(props) {
    super(props);
    this.formInitialData = props.data;
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

  updateSeries = (pid, data) => {
    return eitemApi.update(pid, data);
  };

  createSeries = data => {
    return eitemApi.create(data);
  };

  successCallback = response => {
    goTo(
      BackOfficeRoutes.eitemDetailsFor(getIn(response, 'data.metadata.pid'))
    );
  };

  renderUrlsObjectField = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const objectPath = `${arrayPath}.${indexPath}`;
    return (
      <>
        <StringField
          label="Url"
          fieldPath={`${objectPath}.value`}
          inline={true}
        />
        <StringField
          label="Description"
          fieldPath={`${objectPath}.description`}
          inline={true}
          uiProps={{
            action: (
              <Form.Button
                color="red"
                icon="trash"
                onClick={() => {
                  arrayHelpers.remove(indexPath);
                }}
              ></Form.Button>
            ),
          }}
        />
      </>
    );
  };

  render() {
    return (
      <BaseForm
        initialValues={
          this.formInitialData
            ? this.prepareData(this.formInitialData.metadata)
            : {}
        }
        editApiMethod={this.updateSeries}
        createApiMethod={this.createSeries}
        successCallback={this.successCallback}
        successSubmitMessage={this.successSubmitMessage}
        title={this.title}
        pid={this.pid ? this.pid : undefined}
        submitSerializer={eitemSubmitSerializer}
      >
        <DocumentField label="Document" fieldPath="document" />
        <TextField
          label="Description"
          fieldPath="description"
          uiProps={{ rows: 5 }}
        />
        <BooleanField
          label="Open access"
          fieldPath="open_access"
          uiProps={{ toggle: true }}
        />
        <AccordionField label="Urls" fieldPath="urls">
          <ArrayField
            fieldPath="urls"
            defaultNewValue={{ value: '', url: '' }}
            render={this.renderUrlsObjectField}
          ></ArrayField>
        </AccordionField>
        <TextField
          label="Internal notes"
          fieldPath="internal_notes"
          uiProps={{ rows: 5 }}
        />
      </BaseForm>
    );
  }
}

EItemForm.propTypes = {
  formInitialData: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string,
};
