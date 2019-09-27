import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik, getIn } from 'formik';
import { Button, Container, Form, Header, Segment } from 'semantic-ui-react';
import { sessionManager } from '../../../../authentication/services';
import { StringField, TextField } from '../../../../forms';
import * as Yup from 'yup';
import { FrontSiteRoutes } from '../../../../routes/urls';
import { documentRequest as documentRequestApi } from '../../../../common/api';
import { goTo } from '../../../../history';
import { ES_DELAY } from '../../../../common/config';
import isEmpty from 'lodash/isEmpty';

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

  onSubmit = async (values, actions) => {
    this.setState({ data: values });

    const data = {
      patron_pid: sessionManager.user.id,
      ...values,
    };

    try {
      actions.setSubmitting(true);
      await documentRequestApi.create(data);

      this.props.sendSuccessNotification(
        'Success!',
        `Your book request has been sent to the library.`
      );
      setTimeout(() => {
        goTo(FrontSiteRoutes.patronProfile);
      }, ES_DELAY);
    } catch (error) {
      const errors = getIn(error, 'response.data.errors', []);
      if (isEmpty(errors)) {
        throw error;
      } else {
        const errorData = error.response.data;
        const payload = {};
        for (const fieldError of errorData.errors) {
          payload[fieldError.field] = fieldError.message;
        }
        actions.setErrors(payload);
        actions.setSubmitting(false);
      }
    }
  };

  renderForm() {
    return (
      <Formik
        initialValues={this.state.data}
        validationSchema={RequestSchema}
        onSubmit={this.onSubmit}
        render={({ handleSubmit, isSubmitting }) => (
          <Form
            id="document-request-form"
            onSubmit={handleSubmit}
            loading={isSubmitting}
          >
            <StringField
              fieldPath="title"
              label="Title"
              placeholder="Title"
              required
            ></StringField>
            <StringField
              fieldPath="authors"
              label="Authors"
              placeholder="Authors"
            ></StringField>
            <Form.Group widths="equal">
              <StringField
                fieldPath="isbn"
                label="ISBN"
                placeholder="ISBN"
              ></StringField>
              <StringField
                fieldPath="issn"
                label="ISSN"
                placeholder="ISSN"
              ></StringField>
            </Form.Group>
            <Form.Group widths="equal">
              <StringField
                fieldPath="volume"
                label="Volume"
                placeholder="Volume number"
              ></StringField>
              <StringField
                fieldPath="issue"
                label="Issue"
                placeholder="Issue number"
              ></StringField>
              <StringField
                fieldPath="page"
                label="Page"
                placeholder="Page number"
              ></StringField>
              <StringField
                fieldPath="publication_year"
                label="Publication Year"
                placeholder="Publication Year"
              ></StringField>
            </Form.Group>
            <TextField
              fieldPath="note"
              label="Note"
              placeholder="Notes for the library"
              uiProps={{ rows: 5 }}
            ></TextField>

            <Button type="submit" disabled={isSubmitting}>
              Request Book
            </Button>
          </Form>
        )}
      />
    );
  }

  render() {
    return (
      <Container id="document-request">
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
