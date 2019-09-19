import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik, getIn } from 'formik';
import { Button, Container, Form, Header, Segment } from 'semantic-ui-react';
import { sessionManager } from '../../../authentication/services';
import * as Yup from 'yup';
import { FrontSiteRoutes } from '../../../routes/urls';
import { documentRequest as documentRequestApi } from '../../../common/api';
import { goTo } from '../../../history';
import { ES_DELAY } from '../../../common/config';
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

  renderError(errors, name, direction = 'above') {
    const error = errors[name];
    return error
      ? {
          content: error,
          pointing: direction,
        }
      : null;
  }

  onSubmit = async (values, actions) => {
    this.setState({ data: values });

    const data = {
      patron_pid: sessionManager.user.id,
      ...values,
    };

    try {
      const response = await documentRequestApi.create(data);

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
              value={getIn(values, 'title', '')}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Form.Input
              fluid
              name="authors"
              error={this.renderError(errors, 'authors')}
              label="Authors"
              placeholder="Authors"
              value={getIn(values, 'authors', '')}
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
                value={getIn(values, 'isbn', '')}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Form.Input
                fluid
                name="issn"
                error={this.renderError(errors, 'issn')}
                label="ISSN"
                placeholder="ISSN"
                value={getIn(values, 'issn', '')}
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
                value={getIn(values, 'volume', '')}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Form.Input
                fluid
                name="issue"
                error={this.renderError(errors, 'issue')}
                label="Issue"
                placeholder="Issue number"
                value={getIn(values, 'issue', '')}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Form.Input
                fluid
                name="page"
                error={this.renderError(errors, 'page')}
                label="Page"
                placeholder="Page number"
                value={getIn(values, 'page', '')}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Form.Input
                fluid
                name="publication_year"
                error={this.renderError(errors, 'publication_year')}
                label="Publication Year"
                placeholder="Publication Year"
                value={getIn(values, 'publication_year', '')}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
            <Form.TextArea
              name="note"
              error={this.renderError(errors, 'note')}
              label="Note"
              placeholder="Notes for the library"
              value={getIn(values, 'note', '')}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Request Book'}
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
