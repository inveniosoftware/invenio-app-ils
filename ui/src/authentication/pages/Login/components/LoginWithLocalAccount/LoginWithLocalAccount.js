import React, { Component } from 'react';
import { getIn } from 'formik';
import { Container } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { BaseForm, StringField } from '@forms';
import { authenticationService } from '@authentication/services';
import { goTo } from '@history';
import { FrontSiteRoutes } from '@routes/urls';
import { parseParams } from '../../../../utils';

export default class LoginWithLocalAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        email: '',
        password: '',
      },
    };
  }

  get buttons() {
    return [
      {
        name: 'login',
        content: 'Log In',
        primary: true,
        type: 'submit',
        fluid: true,
      },
    ];
  }

  onSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      const response = await authenticationService.loginWithLocalAccount(
        values
      );
      this.onSuccess(response);
    } catch (error) {
      const errors = getIn(error, 'response.data.errors', []);

      if (isEmpty(errors)) {
        const message = getIn(error, 'response.data.message', null);
        if (message) {
          actions.setSubmitting(false);
          actions.setErrors({ message });
        }
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

  onSuccess = response => {
    const params = parseParams(window.location.search);
    this.props.fetchUserProfile();
    this.props.clearNotifications();
    goTo(params.next || FrontSiteRoutes.home);
  };

  renderForm() {
    return (
      <BaseForm
        initialValues={this.state.data}
        buttons={this.buttons}
        onSubmit={this.onSubmit}
      >
        <StringField
          fieldPath="email"
          placeholder="Email Address"
          type="email"
          icon="user"
          iconPosition="left"
          required
        />
        <StringField
          fieldPath="password"
          placeholder="Password"
          type="password"
          icon="lock"
          iconPosition="left"
          required
        />
      </BaseForm>
    );
  }

  render() {
    return (
      <Container id="login-with-local-account-form" className={'spaced'}>
        {this.renderForm()}
      </Container>
    );
  }
}
