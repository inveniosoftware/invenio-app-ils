import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field } from 'formik';
import { Form, Card, Icon, Label } from 'semantic-ui-react';
import { ESSelector } from '../../common/components/ESSelector';
import isEmpty from 'lodash/isEmpty';

export class SelectorField extends Component {
  state = {
    value: null,
  };

  renderEmpty = () => (
    <Card
      header={this.props.emptyHeader}
      description={this.props.emptyDescription}
    />
  );

  defaultRenderSelection = (selection, removeSelection) => {
    return (
      <Card fluid={!this.props.multiple} key={selection.id}>
        <Card.Content>
          <Card.Header as="a" onClick={() => removeSelection(selection)}>
            {selection.title}
            <Icon name="delete" />
          </Card.Header>
          <Card.Meta>{selection.extra}</Card.Meta>
          <Card.Description>{selection.description}</Card.Description>
        </Card.Content>
      </Card>
    );
  };

  defaultRenderGroup = (selections, renderSelection, removeSelection) => {
    if (isEmpty(selections)) {
      return this.renderEmpty();
    }

    return (
      <Card.Group>
        {selections.map(selection =>
          renderSelection(selection, removeSelection)
        )}
      </Card.Group>
    );
  };

  onSelectionsUpdate = (selections, setFieldValue) => {
    this.setState({ value: selections });
    if (this.props.multiple) {
    } else {
      setFieldValue(
        this.props.fieldPath,
        selections.length > 0 ? selections[0].metadata : {}
      );
    }
  };

  hasFieldError(errors, name, value) {
    const error = errors[name];
    return !isEmpty(error);
  }

  renderFormField = ({ form: { errors, setFieldValue, values } }) => {
    const {
      fieldPath,
      errorPath,
      emptyHeader,
      emptyDescription,
      label,
      required,
      multiple,
      optimized,
      placeholder,
      serializer,
      renderGroup,
      renderSelection,
      ...selectorProps
    } = this.props;
    const selections = [];
    const value = values[fieldPath];
    if (multiple) {
      for (const record of value) {
        if (!isEmpty(record)) {
          selections.push(serializer({ metadata: record }));
        }
      }
    } else {
      if (!isEmpty(value)) {
        selections.push(serializer({ metadata: value }));
      }
    }
    const hasFieldError = this.hasFieldError(errors, errorPath, value);
    const error = errors[errorPath];
    const placeholderText =
      !multiple && selections.length > 0 ? selections[0].title : placeholder;
    return (
      <Form.Field required={required} error={hasFieldError}>
        {label && <label htmlFor={fieldPath}>{label}</label>}
        {hasFieldError && !isEmpty(error) && (
          <Label prompt pointing="below">
            {error}
          </Label>
        )}
        <ESSelector
          id={fieldPath}
          name={fieldPath}
          multiple={multiple}
          initialSelections={selections}
          renderSelections={renderGroup}
          renderSelection={renderSelection}
          onSelectionsUpdate={selections =>
            this.onSelectionsUpdate(selections, setFieldValue)
          }
          serializer={serializer}
          placeholder={placeholderText}
          {...selectorProps}
        />
      </Form.Field>
    );
  };

  render() {
    const FormikField = this.props.optimized ? FastField : Field;
    return (
      <FormikField
        name={this.props.fieldPath}
        component={this.renderFormField}
      />
    );
  }
}

SelectorField.propTypes = {
  emptyDescription: PropTypes.string,
  emptyHeader: PropTypes.string,
  errorPath: PropTypes.string.isRequired,
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  optimized: PropTypes.bool,
  serializer: PropTypes.func.isRequired,
  renderGroup: PropTypes.func,
  renderSelection: PropTypes.func,
  required: PropTypes.bool,
};

SelectorField.defaultProps = {
  emptyHeader: 'Nothing selected',
  emptyDescription: 'Please select a value before saving.',
  optimized: false,
};
