import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import {
  DocumentInfo,
  DocumentRequestActions,
  DocumentRequestHeader,
  DocumentRequestMetadata,
  DocumentRequestSteps,
} from './components';

export default class DocumentRequestDetails extends Component {
  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.documentRequestPid) {
        this.props.fetchDocumentRequestDetails(
          location.state.documentRequestPid
        );
      }
    });
    this.props.fetchDocumentRequestDetails(
      this.props.match.params.documentRequestPid
    );
  }

  componentWillUnmount() {
    this.unlisten();
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
            <DocumentInfo />
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
