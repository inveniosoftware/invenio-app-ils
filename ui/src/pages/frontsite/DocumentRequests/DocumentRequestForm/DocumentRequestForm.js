import { documentRequest as documentRequestApi } from '@api';
import { delay } from '@api/utils';
import { AuthenticationGuard } from '@authentication/components/AuthenticationGuard';
import {
  BaseForm,
  GroupField,
  StringField,
  TextField,
  YearInputField,
} from '@forms';
import { goTo } from '@history';
import { FrontSiteRoutes } from '@routes/urls';
import { getIn } from 'formik';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment } from 'semantic-ui-react';
import * as Yup from 'yup';

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

  createDocumentRequest = async data => {
    const response = await documentRequestApi.create(data);
    await delay();
    return response;
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
        createApiMethod={this.createDocumentRequest}
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

  renderAuthorized() {
    return (
      <Container id="document-request" className={'spaced'}>
        <Header as="h1">Request new literature</Header>
        <p>
          Fill in the form below to request a new literature from the library.
        </p>
        <p>
          You can see all your requests on your{' '}
          <Link to={FrontSiteRoutes.patronProfile}>profile</Link> page.
        </p>
        <Segment>{this.renderForm()}</Segment>
      </Container>
    );
  }
  render() {
    return (
      <AuthenticationGuard
        authorizedComponent={() => this.renderAuthorized()}
      />
    );
  }
}
