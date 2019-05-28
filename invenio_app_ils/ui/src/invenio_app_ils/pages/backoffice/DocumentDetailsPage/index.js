import React from 'react';
import { Container } from 'semantic-ui-react';
import { DocumentDetails } from './DocumentDetails';
import { DocumentItems } from './DocumentItems';
import { DocumentPendingLoans } from './DocumentPendingLoans';

export const DocumentDetailsPage = () => (
  <Container>
    <DocumentDetails />
    <DocumentPendingLoans />
    <DocumentItems />
  </Container>
);
