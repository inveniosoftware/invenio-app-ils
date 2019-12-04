import React from 'react';
import { Header } from 'semantic-ui-react';

export default function PatronMetadata(props) {
  return (
    <>
      <Header as="h2">Welcome {props.user.username}!</Header>
      <Header.Subheader>
        You can check your library activity on this page
      </Header.Subheader>
    </>
  );
}
