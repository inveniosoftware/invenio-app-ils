import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getIn } from 'formik';
import { Container, Header, Segment } from 'semantic-ui-react';
import {
  BaseForm,
  StringField,
  TextField,
  YearInputField,
  GroupField,
} from '@forms';
import * as Yup from 'yup';
import { FrontSiteRoutes } from '@routes/urls';
import { documentRequest as documentRequestApi } from '@api';
import { goTo } from '@history';

const ERROR_MSGS = {
  publication_year: 'Not a valid year',
};

const RequestSchema = Yup.object().shape({
  title: Yup.string().required(),
  publication_year: Yup.number()
    .typeError(ERROR_MSGS.publication_year)
    .integer(ERROR_MSGS.publication_year),
});

export default class DocumentRequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        title: getIn(props, 'location.state.queryString', ''),
      },
    };
  }

  onSerializeSubmit = values => {
    return {
      ...values,
      patron_pid: this.props.user.id,
    };
  };

  onSubmitSuccess = () => {
    goTo(FrontSiteRoutes.patronProfile);
  };

  renderForm() {
    return (
      <BaseForm
        initialValues={this.state.data}
        validationSchema={RequestSchema}
        submitSerializer={this.onSerializeSubmit}
        successCallback={this.onSubmitSuccess}
        successSubmitMessage="Your book request has been sent to the library."
        createApiMethod={documentRequestApi.create}
      >
        <StringField
          fieldPath="title"
          label="Title"
          placeholder="Title"
          required
        />
        <StringField
          fieldPath="journal_title"
          label="Journal title"
          placeholder="Journal title"
        />
        <StringField
          fieldPath="authors"
          label="Authors"
          placeholder="Authors"
        />
        <GroupField widths="equal">
          <StringField fieldPath="isbn" label="ISBN" placeholder="ISBN" />
          <StringField fieldPath="issn" label="ISSN" placeholder="ISSN" />
        </GroupField>
        <GroupField widths="equal">
          <StringField
            fieldPath="edition"
            label="Edition"
            placeholder="Edition number"
          />
          <StringField
            fieldPath="volume"
            label="Volume"
            placeholder="Volume number"
          />
          <StringField
            fieldPath="issue"
            label="Issue"
            placeholder="Issue number"
          />
          <StringField
            fieldPath="standard_number"
            label="Standard number"
            placeholder="Standard number"
          />
        </GroupField>
        <GroupField widths="equal">
          <StringField
            fieldPath="page"
            label="Page"
            placeholder="Page number"
          />
          <YearInputField
            fieldPath="publication_year"
            label="Publication Year"
            placeholder="Publication Year"
          />
        </GroupField>
        <TextField
          fieldPath="note"
          label="Note"
          placeholder="Notes for the library"
          rows={5}
        />
      </BaseForm>
    );
  }

  render() {
    return (
      <Container id="document-request" className={'spaced'}>
        <Header as="h1">Request new book</Header>
        <p>Fill in the form below to request a new book from the library.</p>
        <p>
          You can see all your book requests on your{' '}
          <Link to={FrontSiteRoutes.patronProfile}>profile</Link> page.
        </p>
        <Segment>{this.renderForm()}</Segment>
      </Container>
    );
  }
}
