import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button } from 'semantic-ui-react';

export class SubForm extends Component {
  render() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.props.initialValues}
        onSubmit={this.props.onSubmit}
        validationSchema={this.props.validationSchema}
        render={({ submitForm }) => (
          <>
            {this.props.children}
            <Button
              secondary
              type="button"
              onClick={submitForm}
              content={this.props.submitButtonText}
            />
          </>
        )}
      />
    );
  }
}

SubForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string,
};

SubForm.defaultPrpos = {
  submitButtonText: 'Save',
}
