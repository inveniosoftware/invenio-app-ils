import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import {
  PatronCurrentLoans,
  PatronMetadata,
  PatronPastLoans,
  PatronPendingLoans,
} from './components';
import { sessionManager } from '../../../authentication/services';

export class ProfileContainer extends Component {
  render() {
    const currentUser = sessionManager.user;
    return (
      <Container>
        <PatronMetadata />
        <PatronPendingLoans patronPid={currentUser.id} />
        <PatronCurrentLoans patronPid={currentUser.id} />
        <PatronPastLoans patronPid={currentUser.id} />
      </Container>
    );
  }
}
