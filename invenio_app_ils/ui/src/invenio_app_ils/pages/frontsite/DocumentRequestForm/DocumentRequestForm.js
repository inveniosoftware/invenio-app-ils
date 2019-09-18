import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { Button, Container, Form, Header, Segment } from 'semantic-ui-react';
import { sessionManager } from '../../../authentication/services';
import * as Yup from 'yup';
import { FrontSiteRoutes } from '../../../routes/urls';
import { Loader } from '../../../common/components';
import get from 'lodash/get';

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
  state = {
    data: {},
  };

  get initialValues() {
    const values = {
      title: get(this.props, 'location.state.queryString', ''),
      authors: '',
      isbn: '',
      issn: '',
      volume: '',
      issue: '',
      page: '',
      publication_year: '',
      note: '',
    };
    for (const [key, value] of Object.entries(this.state.data)) {
      if (key in values) {
        values[key] = value;
      }
    }
    return values;
  }

  renderError(errors, name, direction = 'above') {
    const serverError = this.props.error ? this.props.error[name] : null;
    const error = serverError || errors[name];
    return error
      ? {
          content: error,
          pointing: direction,
        }
      : null;
  }

  onSubmit = (values, actions) => {
    this.setState({ data: values });

    const data = {
      patron_pid: sessionManager.user.id,
    };

    // Remove all empty values
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        data[key] = value;
      }
    }
    this.props.createDocumentRequest(data, actions);
  };

  renderForm() {
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={RequestSchema}
        onSubmit={this.onSubmit}
        render={({
          values,
          errors,
          status,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form id="document-request-form" onSubmit={handleSubmit}>
            <Form.Input
              fluid
              required
              name="title"
              error={this.renderError(errors, 'title')}
              label="Title"
              placeholder="Title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Form.Input
              fluid
              name="authors"
              error={this.renderError(errors, 'authors')}
              label="Authors"
              placeholder="Authors"
              value={values.authors}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Form.Group widths="equal">
              <Form.Input
                fluid
                name="isbn"
                error={this.renderError(errors, 'isbn')}
                label="ISBN"
                placeholder="ISBN"
                value={values.isbn}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Form.Input
                fluid
                name="issn"
                error={this.renderError(errors, 'issn')}
                label="ISSN"
                placeholder="ISSN"
                value={values.issn}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                name="volume"
                error={this.renderError(errors, 'volume')}
                label="Volume"
                placeholder="Volume number"
                value={values.volume}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Form.Input
                fluid
                name="issue"
                error={this.renderError(errors, 'issue')}
                label="Issue"
                placeholder="Issue number"
                value={values.issue}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Form.Input
                fluid
                name="page"
                error={this.renderError(errors, 'page')}
                label="Page"
                placeholder="Page number"
                value={values.page}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Form.Input
                fluid
                name="publication_year"
                error={this.renderError(errors, 'publication_year')}
                label="Publication Year"
                placeholder="Publication Year"
                value={values.publication_year}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
            <Form.TextArea
              name="note"
              error={this.renderError(errors, 'note')}
              label="Note"
              placeholder="Notes for the library"
              value={values.note}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <Button type="submit" disabled={isSubmitting}>
              Request Book
            </Button>
          </Form>
        )}
      />
    );
  }

  render() {
    const { isLoading } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Container id="document-request">
          <Header as="h1">Request new book</Header>
          <p>Fill in the form below to request a new book from the library.</p>
          <p>
            You can see all your book requests on your{' '}
            <Link to={FrontSiteRoutes.patronProfile}>profile</Link> page.
          </p>
          <Segment>{this.renderForm()}</Segment>
        </Container>
      </Loader>
    );
  }
}
