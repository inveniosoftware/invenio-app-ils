import React from 'react';
import { Header } from 'semantic-ui-react';
import { sessionManager } from '../../../../../authentication/services';

export default function PatronMetadata(props) {
  return <Header as="h2">Profile of {sessionManager.user.username}</Header>;
}
