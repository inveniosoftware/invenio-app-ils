import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { Form } from 'semantic-ui-react';

export class GroupField extends Component {
  constructor(props) {
    super(props);

    const { fieldPath, children, title, ...uiProps } = this.props;
    this.fieldPath = fieldPath;
    this.children = children;
    this.title = title;
    this.uiProps = uiProps;
  }

  hasGroupErrors = errors => {
    for (const field in errors) {
      if (field.startsWith(this.fieldPath)) {
        return true;
      }
    }
    return false;
  };

  renderFormField = ({ form: { errors } }) => {
    const classNames = ['form-group'];
    if (this.hasGroupErrors(errors)) {
      classNames.push('error');
    }
    return (
      <fieldset className={classNames.join(' ')}>
        {this.title && <legend>{this.title}</legend>}
        <Form.Group {...this.uiProps}>{this.children}</Form.Group>
      </fieldset>
    );
  };

  render() {
    return <Field name={this.fieldPath} component={this.renderFormField} />;
  }
}

GroupField.propTypes = {
  title: PropTypes.string,
};

GroupField.defaultProps = {};
