import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import {
  PatronCurrentLoans,
  PatronDocumentRequests,
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
        <PatronCurrentLoans patronPid={currentUser.id} />
        <PatronPendingLoans patronPid={currentUser.id} />
        <PatronPastLoans patronPid={currentUser.id} />
        <PatronDocumentRequests patronPid={currentUser.id} />
      </Container>
    );
  }
}
