import React from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';

export class CalendarInputField extends React.Component {
  renderFormField = props => {
    const { fieldPath } = this.props;
    const {
      form: { values, errors, setFieldValue },
    } = props;
    const value = getIn(values, fieldPath, '');
    const error = getIn(errors, fieldPath, null);

    const onChange = (value, name) => {
      setFieldValue(name, value);
    };

    const newProps = {
      error: error,
      form: props.form,
      onChange: onChange,
      value: value,
    };

    return this.props.component(newProps);
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

CalendarInputField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
  optimized: PropTypes.bool,
};

CalendarInputField.defaultProps = {
  optimized: false,
};
