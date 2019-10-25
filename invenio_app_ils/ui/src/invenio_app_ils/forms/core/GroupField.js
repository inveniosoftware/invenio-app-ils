import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';
import { StringField } from './StringField';

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

  renderAction = action => {
    return (
      <div className="group-action">
        {action}
      </div>
    );
  };

  renderFormFieldNew = props => {
    const { action, border, fieldPath, title, children, ...uiProps } = this.props;
    const errors = getIn(props, 'form.errors');
    const classNames = ['form-group'];
    if (border) {
      classNames.push('border');
    }
    if (fieldPath && this.hasGroupErrors(errors)) {
      classNames.push('error');
    }
    return (
      <fieldset className={classNames.join(' ')}>
        {title && <legend>{title}</legend>}
        <Form.Group {...uiProps}>
          {this.props.children}
        </Form.Group>
        {action && this.renderAction(action)}
      </fieldset>
    );
  };

  render() {
    if (this.props.fieldPath) {
      return <Field name={this.fieldPath} component={this.renderFormFieldNew} />;
    } else {
      return this.renderFormFieldNew();
    }
  }
}

GroupField.propTypes = {
  border: PropTypes.bool,
  fieldPath: PropTypes.string,
  title: PropTypes.string,
};

GroupField.defaultProps = {
  border: false,
};
