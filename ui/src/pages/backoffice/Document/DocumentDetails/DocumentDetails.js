import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import history from '@history';
import { Loader, Error } from '@components';
import {
  DocumentMetadata,
  DocumentPendingLoans,
  DocumentRelations,
  DocumentStats,
  DocumentItems,
} from './components';

export default class DocumentDetails extends Component {
  constructor(props) {
    super(props);
    this.deleteDocument = this.props.deleteDocument;
    this.fetchDocumentDetails = this.props.fetchDocumentDetails;
  }

  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Document') {
        this.fetchDocumentDetails(loc.state.pid);
      }
    });
    this.fetchDocumentDetails(this.props.match.params.documentPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Container>
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <DocumentMetadata />
            <DocumentPendingLoans />
            <DocumentItems />
            <DocumentRelations />
            <DocumentStats />
          </Error>
        </Loader>
      </Container>
    );
  }
}

DocumentDetails.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  fetchDocumentDetails: PropTypes.func.isRequired,
};
