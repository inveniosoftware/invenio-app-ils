import React from 'react';
import { Field } from 'formik';
import cloneDeep from 'lodash/cloneDeep';
import { AuthorForm } from './AuthorForm';
import {
  SubForm,
  GroupField,
  ObjectListField,
} from '../../../../../../../../../forms';

export class AuthorsField extends React.Component {
  onSubmit = (values, index, setFieldValue, setShowForm) => {
    setFieldValue(`authors.${index}`, values);
    setShowForm(false);
  };

  renderFormField = props => {
    const {
      form: { values, setFieldValue },
    } = props;
    const authorValues = cloneDeep(values.authors);

    return (
      <ObjectListField
        fieldPath={this.props.fieldPath}
        keyField="full_name"
        renderItem={(index, setShowForm) => {
          return (
            <GroupField>
              <SubForm
                initialValues={authorValues[index]}
                submitButtonText="Save author"
                onSubmit={(values, actions) =>
                  this.onSubmit(values, index, setFieldValue, setShowForm)
                }
              >
                <AuthorForm />
              </SubForm>
            </GroupField>
          );
        }}
      />
    );
  };

  render() {
    return <Field name={this.fieldPath} component={this.renderFormField} />;
  }
}
