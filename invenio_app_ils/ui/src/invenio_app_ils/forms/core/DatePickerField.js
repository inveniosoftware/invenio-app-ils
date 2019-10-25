import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form, Icon } from 'semantic-ui-react';
import {
  DateTimeInput,
  YearInput,
  DateInput,
} from 'semantic-ui-calendar-react';

export class DatePickerField extends Component {
  constructor(props) {
    super(props);
    const {
      fieldPath,
      inline,
      placeholder,
      minDate,
      maxDate,
      mode,
      ...uiProps
    } = props;
    this.fieldPath = fieldPath;
    this.inline = inline;
    this.placeholder = placeholder;
    this.uiProps = uiProps;
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.mode = mode;
  }

  dateComponent = props => {
    const { mode, ...rest } = props;
    switch (mode) {
      case 'year':
        return <YearInput {...rest} />;
      case 'datetime':
        return <DateTimeInput {...rest} />;
      default:
        return <DateInput {...rest} />;
    }
  };

  renderError(errors, name, direction = 'above') {
    const error = errors[name];
    return error
      ? {
          content: error,
          pointing: direction,
        }
      : null;
  }

  renderFormField = props => {
    const {
      form: { values, handleChange, handleBlur, errors },
    } = props;
    console.log(values);

    const componentProps = {
      autoComplete: 'off',
      clearable: true,
      clearIcon: <Icon name="remove" color="red" />,
      closable: true,
      iconPosition: 'left',
      minDate: this.minDate,
      maxDate: this.maxDate,
      name: this.fieldPath,
      id: this.fieldPath,
      onBlur: handleBlur,
      onChange: (e, { value }) => {
        console.log(value);
        handleChange(e);
      },
      error: this.renderError(errors, this.fieldPath),
      value: getIn(values, this.fieldPath, ''),
      mode: this.mode,
      ...this.uiProps,
    };
    return (
      <Form.Field inline={this.inline}>
        <this.dateComponent {...componentProps} />
      </Form.Field>
    );
  };

  render() {
    return (
      <Field name={this.fieldPath} component={this.renderFormField}></Field>
    );
  }
}

DatePickerField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  mode: PropTypes.oneOf(['year', 'date', 'datetime']),
};

DatePickerField.defaultProps = {
  inline: false,
  minDate: '1900',
  maxDate: '2200',
};
