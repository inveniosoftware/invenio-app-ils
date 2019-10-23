import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';

export class GroupField extends Component {
  hasGroupErrors = errors => {
    for (const field in errors) {
      if (field.startsWith(this.props.fieldPath)) {
        return true;
      }
    }
    return false;
  };

  renderFormField = props => {
    const { fieldPath, title, children } = this.props;
    const errors = getIn(props, 'form.errors');
    const classNames = ['form-group'];
    if (fieldPath && this.hasGroupErrors(errors)) {
      classNames.push('error');
    }
    return (
      <fieldset className={classNames.join(' ')}>
        {title && <legend>{title}</legend>}
        {children}
      </fieldset>
    );
  };

  render() {
    if (this.props.fieldPath) {
      return <Field name={this.fieldPath} component={this.renderFormField} />;
    } else {
      return this.renderFormField();
    }
  }
}

GroupField.propTypes = {
  fieldPath: PropTypes.string,
  title: PropTypes.string,
};

GroupField.defaultProps = {
};
