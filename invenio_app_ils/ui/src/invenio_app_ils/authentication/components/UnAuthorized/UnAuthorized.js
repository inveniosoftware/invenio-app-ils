import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BackOfficeURLS } from '../../../common/urls';

export class UnAuthorized extends Component {
  render() {
    return <Redirect to={BackOfficeURLS.home} data-test="unauthorized" />;
  }
}
