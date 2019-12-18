import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';
import { Form, Dropdown, Input, Label } from 'semantic-ui-react';
import { invenioConfig } from '@config';

// Wrapped Dropdown so we submit the selected value of the dropdown with the form
const DropdownField = ({
  field: { name, value },
  form: { touched, errors, setFieldValue },
  options,
  children: _,
  ...props
}) => {
  const errorText = touched[name] && errors[name];
  return (
    <Dropdown
      selection
      options={options}
      value={value ? value : options[0].value}
      onChange={(_, { value }) => setFieldValue(name, value)}
      error={errorText}
      {...props}
    />
  );
};

export class PriceField extends Component {
  renderError(errors, name, direction = 'above') {
    const error = errors[name];
    return error
      ? {
          content: error,
          pointing: direction,
        }
      : null;
  }

  renderCurrencyLabel = () => {
    const { currencies, fieldPath, canSelectCurrency } = this.props;
    return canSelectCurrency ? (
      <Field
        options={currencies}
        name={`${fieldPath}.currency`}
        component={DropdownField}
      />
    ) : (
      <Label name={`${fieldPath}.currency`}>
        {invenioConfig.order.defaultCurrency}
      </Label>
    );
  };

  renderFormField = props => {
    const {
      currencies,
      fieldPath,
      inline,
      optimized,
      label,
      required,
      initialValues,
      canSelectCurrency,
      ...uiProps
    } = this.props;
    const {
      form: { values, handleChange, handleBlur, errors, status },
    } = props;
    return (
      <Form.Field inline={inline} required>
        <label>{label}</label>
        <Input
          fluid
          type="number"
          step="any"
          min="0"
          label={this.renderCurrencyLabel()}
          labelPosition="right"
          id={`${fieldPath}.value`}
          name={`${fieldPath}.value`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={getIn(values, `${fieldPath}.value`, '')}
          error={this.renderError(status || errors, fieldPath)}
          {...uiProps}
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

PriceField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  optimized: PropTypes.bool,
};

PriceField.defaultProps = {
  canSelectCurrency: true,
  inline: false,
  optimized: true,
};
