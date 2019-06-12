import React from 'react';
import { Container } from 'semantic-ui-react';
import {
  DocumentDetails,
  DocumentItems,
  DocumentPendingLoans,
} from './components';

export const DocumentDetailsPage = () => (
  <Container>
    <DocumentDetails />
    <DocumentPendingLoans />
    <DocumentItems />
  </Container>
);
