import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import {
  DocumentRequestActions,
  DocumentRequestHeader,
  DocumentRequestMetadata,
  DocumentRequestSteps,
} from './components';

export default class DocumentRequestDetails extends Component {
  componentDidMount() {
    this.props.fetchDocumentRequestDetails(
      this.props.match.params.documentRequestPid
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.documentRequestPid !==
      this.props.match.params.documentRequestPid
    ) {
      this.props.fetchDocumentRequestDetails(
        this.props.match.params.documentRequestPid
      );
    }
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Container fluid className="spaced">
            <DocumentRequestHeader />
            <Divider />
            <DocumentRequestActions />
            <Divider />
          </Container>
          <Container>
            <DocumentRequestMetadata />
            <Divider />
            <DocumentRequestSteps />
          </Container>
        </Error>
      </Loader>
    );
  }
}

DocumentRequestDetails.propTypes = {
  fetchDocumentRequestDetails: PropTypes.func.isRequired,
};
