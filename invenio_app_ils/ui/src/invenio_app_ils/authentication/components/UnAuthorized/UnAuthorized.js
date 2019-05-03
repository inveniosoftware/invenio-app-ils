import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BackOfficeRoutes } from '../../../routes/urls';

export class UnAuthorized extends Component {
  render() {
    return <Redirect to={BackOfficeRoutes.home} data-test="unauthorized" />;
  }
}
