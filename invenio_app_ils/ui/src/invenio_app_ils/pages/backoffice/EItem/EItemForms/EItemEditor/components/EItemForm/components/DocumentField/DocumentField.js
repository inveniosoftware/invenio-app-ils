import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import { document as documentApi } from '../../../../../../../../../common/api/documents/document';
import { ESSelectorModal } from '../../../../../../../../../common/components/ESSelector';
import { serializeDocument } from '../../../../../../../../../common/components/ESSelector/serializer';

export class DocumentField extends Component {
  constructor(props) {
    super(props);
    this.fieldPath = props.fieldPath;
    this.label = props.label;
  }

  hasFieldError(errors, name) {
    const error = errors[name];
    return !isEmpty(error);
  }

  renderLabel = ({ id, title, description }) => (
    <Card
      fluid
      header={title}
      meta={`Document : ${id}`}
      description={description}
    />
  );

  renderDocumentField = props => {
    const {
      form: { values, setFieldValue, errors },
    } = props;
    const document = getIn(values, this.fieldPath, {});
    const documentSelections = !isEmpty(document)
      ? [serializeDocument({ metadata: document })]
      : [];
    const error = this.hasFieldError(errors, 'document_pid');
    return (
      <>
        <Form.Field required error={error}>
          <label>{this.label}</label>
          {!isEmpty(document) ? (
            this.renderLabel(serializeDocument({ metadata: document }))
          ) : (
            <Message
              negative={error ? true : false}
              header={'No document has been selected.'}
              content={'You must select a new document related to this eitem.'}
            />
          )}
        </Form.Field>
        <Form.Field>
          <ESSelectorModal
            initialSelections={documentSelections}
            trigger={
              <Button
                basic
                color="blue"
                size="small"
                content={
                  !isEmpty(document) ? 'Edit document' : 'Add new document'
                }
                type="button"
              />
            }
            query={documentApi.list}
            serializer={serializeDocument}
            title="Select Document"
            onSave={results => {
              const selectedDocument =
                results.length > 0 ? results[0].metadata : {};
              setFieldValue(this.fieldPath, {
                ...selectedDocument,
              });
            }}
          ></ESSelectorModal>
        </Form.Field>
      </>
    );
  };
  render() {
    return (
      <Field name={this.fieldPath} component={this.renderDocumentField}></Field>
    );
  }
}

DocumentField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
};

DocumentField.defaultProps = {
  label: '',
};
