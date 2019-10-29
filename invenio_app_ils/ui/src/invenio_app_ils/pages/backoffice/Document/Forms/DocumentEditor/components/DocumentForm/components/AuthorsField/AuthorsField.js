import React from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';
import cloneDeep from 'lodash/cloneDeep';
import { AuthorForm } from './AuthorForm';
import {
  SubForm,
  GroupField,
  ObjectListField,
} from '../../../../../../../../../forms';
import { invenioConfig } from '../../../../../../../../../common/config';
import { AuthorSearchField } from './AuthorSearchField';

export class AuthorsField extends React.Component {
  state = {
    activeIndex: null,
    showForm: false,
  };

  onRemove = (values, index, setFieldValue) => {
    this.setState({ showForm: false });
    setFieldValue('authors', values.authors.filter((_, i) => i !== index));
  };

  onSubmit = (values, index, setFieldValue) => {
    this.setState({ showForm: false });
    for (const key in values.authors) {
      setFieldValue(`authors.${key}`, values.authors[key]);
    }
  };

  onAuthorSearchChange = value => {
    if (value.length < 1) {
      this.setState({ activeIndex: null, showForm: false });
    }
  };

  onAuthorChange = index => {
    const { activeIndex, showForm } = this.state;
    // Hide then show the form to prevent display issues when switching between
    // authors.
    this.setState({ showForm: false }, () => {
      let showFormUpdated;
      if (index === activeIndex) {
        showFormUpdated = !showForm;
      } else {
        showFormUpdated = index !== null;
      }
      this.setState({ activeIndex: index, showForm: showFormUpdated });
    });
  };

  renderSubForm = (values, errors, setFieldValue) => {
    const activeIndex = this.state.activeIndex;
    const authors = cloneDeep(values.authors);
    const initialValues = {
      authors: {
        [activeIndex]: getIn(authors, activeIndex, {}),
      },
    };

    return (
      <GroupField border grouped>
        <SubForm
          basePath={`authors.${activeIndex}`}
          initialValues={initialValues}
          initialErrors={errors}
          initialStatus={errors}
          removeButtonText="Remove author"
          submitButtonText="Save author"
          onSubmit={(values, actions) =>
            this.onSubmit(values, activeIndex, setFieldValue)
          }
          onRemove={() => this.onRemove(values, activeIndex, setFieldValue)}
          render={(basePath, errors) => (
            <AuthorForm basePath={basePath} errors={errors} />
          )}
        />
      </GroupField>
    );
  };

  renderAuthors = authors => {
    if (authors && authors.length > invenioConfig.authors.maxDisplay) {
      return (
        <AuthorSearchField
          authors={authors}
          onSearchChange={this.onAuthorSearchChange}
          onResultSelect={result => this.onAuthorChange(result.index)}
          showMaxResults={15}
        />
      );
    }

    return (
      <ObjectListField
        fieldPath={this.props.fieldPath}
        keyField="full_name"
        onItemChange={this.onAuthorChange}
      />
    );
  };

  renderFormField = props => {
    const {
      form: { values, setFieldValue, errors },
    } = props;
    const { showForm } = this.state;

    return (
      <>
        {this.renderAuthors(values.authors)}
        {showForm && this.renderSubForm(values, errors, setFieldValue)}
      </>
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

AuthorsField.propTypes = {
  fieldPath: PropTypes.string,
  optimized: PropTypes.bool,
};
