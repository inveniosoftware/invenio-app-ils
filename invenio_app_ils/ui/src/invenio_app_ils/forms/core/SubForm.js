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
        initialErrors={this.props.initialErrors}
        initialStatus={this.props.initialStatus}
        onSubmit={this.props.onSubmit}
        validationSchema={this.props.validationSchema}
        render={({ submitForm }) => (
          <>
            {this.props.render(this.props.basePath)}
            <Button
              secondary
              type="button"
              onClick={submitForm}
              content={this.props.submitButtonText}
            />
            {this.props.onRemove && (
              <Button
                negative
                type="button"
                icon="trash"
                onClick={this.props.onRemove}
              />
            )}
          </>
        )}
      />
    );
  }
}

SubForm.propTypes = {
  basePath: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  onRemove: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  removeButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
};

SubForm.defaultPrpos = {
  submitButtonText: 'Save',
  removeButtonText: 'Remove',
};
